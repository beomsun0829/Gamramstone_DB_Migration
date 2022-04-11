const fs = require('fs').promises;
const fetch = require('node-fetch');

const { env } = require('process')
require('dotenv').config()

var EN_Translation_Data = {}
var CN_Translation_Data = {}
var ETC_Translation_Data = {}
var JP_Translation_Data = {}

var Videos = {}
var Transcriptions = {}
var Translations = {}



async function readFiles(){
    EN_Translation_Data = await fs.readFile('./JsonData/EN_Translation.json', 'utf8')
    EN_Translation_Data = JSON.parse(EN_Translation_Data)

    CN_Translation_Data = await fs.readFile('./JsonData/CN_Translation.json', 'utf8')
    CN_Translation_Data = JSON.parse(CN_Translation_Data)

    JP_Translation_Data = await fs.readFile('./JsonData/JP_Translation.json', 'utf8')
    JP_Translation_Data = JSON.parse(JP_Translation_Data)

    ETC_Translation_Data = await fs.readFile('./JsonData/ETC_Translation.json', 'utf8')
    ETC_Translation_Data = JSON.parse(ETC_Translation_Data)
}

async function refineData_EN(){
    var nowdata = {}
    Translations['en'] = {}
    for(var index = 0; index < EN_Translation_Data.length; index++){
        nowdata = EN_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        if(Videos[_videoid])
            continue
        
        try{
            console.log('GET videoid : ' + _videoid)
            var _videoDetail = await getYoutubeVideoDetail(_videoid)
            var _videoDetailSnippet = _videoDetail['items'][0]['snippet']
            var _videoDetailContent = _videoDetail['items'][0]['contentDetails']

            Videos[_videoid] = {
                id: _videoid,
                channel: _videoDetailSnippet['channelId'],
                state: 0,
                metadata: {
                    title: _videoDetailSnippet['title'],
                    description: _videoDetailSnippet['description'],
                    type : nowdata['영상 분류'][0],
                    url : 'https://youtu.be/' + _videoid,
                    duration : getYoutubeVideoDuration(_videoDetailContent['duration']),
                    uploadDate :_videoDetailSnippet['publishedAt'],
                    deleted : false,
                },
                translations : ['en',]
            }

            if(nowdata['한국어 자막파일'] != 'Null'){
                transcriptions_func(_videoid, nowdata)
            }

            if(nowdata['영어 자막 파일'] != 'Null'){
                translations_func(_videoid, nowdata, 'en')
            }
        }
        catch(e){
            console.log(e)
        }
    }
}

function transcriptions_func(_videoid, nowdata){
    Transcriptions[_videoid] = {
        videoId : _videoid,
        state : nowdata['진행 상황 (from 받아쓰기 + 자막 싱크)'][0],
        caption : {
            caption_state : nowdata['진행 상황'],
            caption_uploads : nowdata['진행 상황'],
            caption_files : nowdata['한국어 자막파일'],
        },
        contributors : [],
        histories : [],
    }
}

function translations_func(_videoid, nowdata, lang){
    Translations[lang][_videoid] = {
        videoId : _videoid,
        state : nowdata['진행 상황'],
        metadata : {
            title : nowdata['제목 (영어 번역)'],
            description : nowdata['세부 정보 (영어 번역)'],
            state : nowdata['진행 상황'],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : nowdata['진행 상황'],
            files : nowdata['영어 자막 파일'],
        },
        contributors : [],
        histories : [],
    }
}

async function getYoutubeVideoDetail(URL){
    requestURL = 'https://www.googleapis.com/youtube/v3/videos?'
    requestURL += 'part=snippet,contentDetails,statistics&'
    requestURL += 'id=' + URL + '&'
    requestURL += 'key=' + process.env.YOUTUBE_API_KEY
    const response = await fetch(requestURL)
    const json = await response.json()
    return json
}

function getVideoIDfromURL(URL){
    var _videoid = URL.toString()
    _videoid = _videoid.replace('https://www.youtube.com/watch?v=', '')
    _videoid = _videoid.slice(0, 11)
    return _videoid
}

function getYoutubeVideoDuration(str){
    str = str.replace('PT', '')
    str = str.replace('H', ':')
    str = str.replace('M', ':')
    str = str.replace('S', '')
    return str
}

async function main(){
    await readFiles()
    await refineData_EN()

    await fs.writeFile('./RefinedData/Videos.json', JSON.stringify(Videos, null, '\t'))
    await fs.writeFile('./RefinedData/Transcriptions.json', JSON.stringify(Transcriptions, null, '\t'))
    await fs.writeFile('./RefinedData/Translations.json', JSON.stringify(Translations, null, '\t'))
}
main()
//test()

async function test(){
    var _videoid = 'KdWPnX7HVCY'
    var _videoDetail = await getYoutubeVideoDetail(_videoid)
    var _videoDetailSnippet = _videoDetail['items'][0]['snippet']
    var _videoDetailContent = _videoDetail['items'][0]['contentDetails']

    Videos[_videoid] = {
        id: _videoid,
        channel: _videoDetailSnippet['channelId'],
        state: 0,
        metadata: {
            title: _videoDetailSnippet['title'],
            description: _videoDetailSnippet['description'],
            type : -1,       //fix require
            url : 'https://youtu.be/' + _videoid,
            duration : getYoutubeVideoDuration(_videoDetailContent['duration']),
            uploadDate : _videoDetailSnippet['publishedAt'],
            deleted : false,
        },
        translations : ['en',]
    }

    console.log(Videos)
}