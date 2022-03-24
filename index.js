const Airtable = require('airtable')
const fs = require('fs')

const mongoose = require('mongoose')

const fetch = require('node-fetch')
const { hash, createHash } = require('blake3')
const { env } = require('process')



Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: env.AIRTABLE_API_KEY,
})

const airtableBase = Airtable.base(env.AIRTABLE_BASE_ID)

airtableBase.table



// ------------------------------------------------------------------ //


mongoose.connect(env.MONGOOSE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('connected to mongodb')
})


const fi = item => (Array.isArray(item) ? item[0] : item)

const getYouTubeId = url => {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi
  const match = url.match(regExp)

  if (match && match[0].length > 11) {
    const id = url.split('v=')[1]

    if (id.indexOf('&list=') > -1) {
      return id.replace(/\&list\=.+/g, '')
    }

    return id
  }

  return ''
}

const dropAllPreviousData = async () => {
  try {
    await db.dropCollection('files')
    await db.dropCollection('captions')
    await db.dropCollection('videos')
    await db.dropCollection('members')
  } catch (e) {
    console.log(`Failed to delete previous collections: ${e.message}`)
  }

}

const getVideos = async () => {
  console.log('[*] Getting videos')

  const videos = await airtableBase
    .table('받아쓰기 + 자막 싱크')
    .select({
      view: '마스터',
    })
    .all()

  fs.writeFileSync('videos.json', JSON.stringify(videos))
}

const VideoTypes = {
  편집: 1,
  쇼츠: 2,
  풀: 3,
  노래: 4,
  기타: 50,
}

const TranscriptionStates = {
  '시작 안함': 1,
  받아쓰기: 2,
  '자막 싱크': 3,
  번역: 4,
  '해당없음 (자막 필요 없는 영상)': 50,
}

const TranslationStates = {
  '시작 안함': 1,
  '자막 싱크': 10,
  번역: 11,
  검수: 20,
  '최종 확인 완료': 21,
  '자막 제작 완료': 50,
  '유튜브 적용 완료': 100,
}

const TranslationMetadataStates = {
  '시작 안함': 1,
  '자막 싱크': 10,
  번역: 10,
  검수: 20,
  '최종 확인 완료': 100,
  '자막 제작 완료': 100,
  '유튜브 적용 완료': 100,
}

const uploadVideos = async videos => {
  videos = videos ?? JSON.parse(fs.readFileSync('videos.json'))

  console.log(`[*] Uploading ${videos.length} videos`)

  let transcriptionFiles = []

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i]

    if (typeof video.fields['제목'] === 'undefined') {
      continue
    }

    console.log(`[+] Adding ${video.fields['제목']} to MongoDB`)

    console.log(video.fields['한국어 자막파일'])

    if (typeof video.fields['한국어 자막파일'] !== 'undefined') {
      transcriptionFiles.push({
        id: getYouTubeId(fi(video.fields['URL'])),
        files: video.fields['한국어 자막파일'],
      })
    }

    await db.collection('videos').insertOne({
      _id: getYouTubeId(fi(video.fields['URL'])),
      metadata: {
        url: fi(video.fields['URL']),
        title: fi(video.fields['제목']),
        type: VideoTypes[fi(video.fields['영상 분류'])] || 0,
        description: fi(video.fields['세부 정보']),
        channel: fi(video.fields['채널']),
        uploadDate: new Date(fi(video.fields['업로드 날짜'])),
        duration: fi(video.fields['영상 길이']),
      },
      transcription: {
        state: TranscriptionStates[fi(video.fields['진행 상황'])] || 0,
        updateDate:
          typeof video.fields['한국어 자막파일'] === 'undefined'
            ? new Date(0)
            : new Date(),
        contributors: [],
        captions: [],
      },
      translations: {},
      histories: [],
      state: 1,
    })
  }

  fs.writeFileSync('transcriptions.json', JSON.stringify(transcriptionFiles))
}

const getIndividualTranslation = async language => {
  console.log(`[*] Getting translations for ${language}`)

  const translations = await airtableBase
    .table(language + ' 번역')
    .select({
      view: '마스터',
    })
    .all()

  console.log(`[*] Fetched translations for ${language}`)

  const result = translations.map(v => {
    // console.log(v)

    return {
      id: getYouTubeId(fi(v.fields['URL'])),
      type: fi(v.fields['풀']),
      state: v.fields['진행 상황'],
      updateDate: v.fields['Last Modified'],
      files: v.fields[`${language} 자막 파일`],
      title: v.fields[`제목 (${language} 번역)`],
      description: v.fields[`세부 정보 (${language} 번역)`],
    }
  })

  fs.writeFileSync(language + '.json', JSON.stringify(result))

  return result
}

const uploadTranscriptions = async transcriptions => {
  transcriptions =
    transcriptions ?? JSON.parse(fs.readFileSync('transcriptions.json'))
  
  console.log(`[*] Uploading ${transcriptions.length} transcriptions`)

  if (!fs.existsSync('./transcriptionFiles')) {
    fs.mkdirSync('./transcriptionFiles')
  }

  for (let i = 0; i < transcriptions.length; i++) {
    const transcription = transcriptions[i]

    transcription.files.forEach(async file => {
      const ext = file.filename.split('.').pop()

      let fileData = null

      if (fs.existsSync(`./transcriptionFiles/${file.id}.${ext}`)) {
        console.log(
          `[+] Adding cached ${file.id} (${file.filename}) to MongoDB`
        )

        fileData = fs.readFileSync(`./transcriptionFiles/${file.id}.${ext}`)
      } else {
        console.log(
          `[+] Downloading ${file.id} (${file.filename}) from Airtable`
        )

        const result = await fetch(file.url)

        if (!result.ok) {
          console.log('Failed to download: ' + file.filename)
          return
        }

        fileData = Buffer.from(new Uint8Array(await result.arrayBuffer()))

        console.log(
          `[+] Downloaded ${file.id} (${file.filename}) from Airtable`
        )

        fs.writeFileSync(`./transcriptionFiles/${file.id}.${ext}`, fileData)
      }

      const hashed = hash(fileData).toString('hex')

      await db.collection('files').insertOne({
        _id: hashed,
        name: file.filename,
        size: fileData.length,
        mime: file.type,
        data: fileData,
      })

      await db.collection('captions').insertOne({
        _id: `tra${transcription.id}-${hash(file.filename).toString('hex')}`,
        name: file.filename,
        size: fileData.length,
        mime: file.type,
        file: hashed,
      })

      await db.collection('videos').updateOne(
        {
          _id: transcription.id,
        },
        {
          $push: {
            'transcription.captions': `tra${transcription.id}-${hash(
              file.filename
            ).toString('hex')}`,
          },
        }
      )
    })
  }
}

const LanguageCodes = {
  영어: 'en',
  한국어: 'ko',
  일본어: 'ja',
  중국어: 'zh',
  프랑스어: 'fr',
  독일어: 'de',
  스페인어: 'es',
  러시아어: 'ru',
  포르투갈어: 'pt',
  베트남어: 'vi',
  인도네시아어: 'id',
  라틴어: 'la',
  말레이시아어: 'ms',
  아랍어: 'ar',
  태국어: 'th',
  스위스어: 'sv',
  베르도리어: 'be',
  덴마크어: 'nl',
  터키어: 'tr',
}

const uploadIndividualTranslation = async language => {
  const translations = JSON.parse(fs.readFileSync(language + '.json'))

  console.log(`[*] Uploading ${translations.length} translations`)

  for (let i = 0; i < translations.length; i++) {
    const translation = translations[i]

    const langId = LanguageCodes[language]

    await db.collection('videos').updateOne(
      {
        _id: translation.id,
      },
      {
        $set: {
          [`translations.${langId}`]: {
            state: TranslationStates[translation.state],
            updateDate: new Date(translation.updateDate ?? 0),
            metadata: {
              state: TranslationMetadataStates[translation.state],
              title: translation.title,
              description: translation.description,
              histories: [],
            },
            contributors: [],
            captions: [],
          },
        },
      }
    )

    if (!fs.existsSync('./translationFiles')) {
      fs.mkdirSync('./translationFiles')
    }

    if (translation.files) {
      translation.files.forEach(async file => {
        const ext = file.filename.split('.').pop()

        let fileData = null

        if (fs.existsSync(`./translationFiles/${file.id}.${ext}`)) {
          console.log(
            `[+] Adding cached ${file.id} (${file.filename}) to MongoDB`
          )

          fileData = fs.readFileSync(`./translationFiles/${file.id}.${ext}`)
        } else {
          console.log(
            `[+] Downloading ${file.id} (${file.filename}) from Airtable`
          )

          const result = await fetch(file.url)

          if (!result.ok) {
            console.log('Failed to download: ' + file.filename)
            return
          }

          fileData = Buffer.from(new Uint8Array(await result.arrayBuffer()))

          console.log(
            `[+] Downloaded ${file.id} (${file.filename}) from Airtable`
          )

          fs.writeFileSync(`./translationFiles/${file.id}.${ext}`, fileData)
        }

        const hashed = hash(fileData).toString('hex')

        try {
          await db.collection('files').insertOne({
            _id: hashed,
            name: file.filename,
            size: fileData.length,
            mime: file.type,
            data: fileData,
          })
        } catch (e) {
          console.log(`[-] Failed to insert ${file.filename}, ${e.message}`)
        }

        const captionId = `trn${translation.id}-${langId}-${hash(
          file.filename
        ).toString('hex')}`

        await db.collection('captions').insertOne({
          _id: captionId,
          name: file.filename,
          size: fileData.length,
          mime: file.type,
          file: hashed,
        })

        await db.collection('videos').updateOne(
          {
            _id: translation.id,
          },
          {
            $push: {
              [`translations.${langId}.captions`]: captionId,
            },
          }
        )
      })
    }
  }
}

;(async () => {
  await dropAllPreviousData()

  const videos = await getVideos()

  await uploadVideos(videos)
  await uploadTranscriptions()

  await getIndividualTranslation('영어')
  await uploadIndividualTranslation('영어')

  await getIndividualTranslation('일본어')
  await uploadIndividualTranslation('일본어')

  await getIndividualTranslation('중국어')
  await uploadIndividualTranslation('중국어')

  console.log('Done!')
})()

// uploadVideos()

// getVideos().catch(console.log)

// uploadTranscriptions()

// getIndividualTranslation('일본어')
// uploadIndividualTranslation('일본어')
