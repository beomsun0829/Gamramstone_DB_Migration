const fs = require('fs').promises;
const fetch = require('node-fetch');

const { env } = require('process')
require('dotenv').config()

var EN_Translation_Data = {}
var CN_Translation_Data = {}
var ETC_Translation_Data = {}
var JP_Translation_Data = {}

var Videos = []
var Transcriptions = []
var Translations_EN = []
var Translations_JP = []
var Translations_CN = []
var Translations_FR = []
var Translations_ES = []
var Translations_AR = []
var Translations_VI = []

const VideoState = {            //전부 0
    0 : '미지정',
    1 : '잠금',
    2 : '읽기 전용'
}
const TranscriptionState = {    //받아쓰기 + 자막 싱크 - 진행상황
    "해당없음 (자막 필요 없는 영상)" : -1,
    "시작안함" : 0,
    "받아쓰기" : 1,
    "자막 싱크" : 2,
    "번역" : 99
}
const TranslationState_Metadata = {      //각 언어 테이블 (영어 번역, 중국어 번역, 일본어 번역, 기타 언어 번역) 의 진행 상황 필드
    "번역" : 1,
    "검수" : 50,
    "최종 확인 대기" : 100,
    "자막 제작 완료" : 100,
    "유튜브 적용 완료" : 100
}
const TranslationState = {              //각 언어 테이블의 진행 상황 필드 값
    "Null" : 0,
    "번역, 검수" : 1,
    "자막 제작 완료" : 100,
    "유튜브 적용 완료" : 110
}

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
    console.log('----------------- refineData_EN -----------------')
    var nowdata = {}
    for(var index = 0; index < EN_Translation_Data.length; index++){
        nowdata = EN_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        if(_videoid == 'N')
            continue

        await video_Push(_videoid, nowdata, 'en')
        
        transcriptions_func(_videoid, nowdata)
        translations_func_EN(_videoid, nowdata)
    }
}

async function refineData_JP(){
    console.log('----------------- refineData_JP -----------------')
    var nowdata = {}
    for(var index = 0; index < JP_Translation_Data.length; index++){
        nowdata = JP_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        if(_videoid == 'N')
            continue

        var exist_sw = false
        for(idIndex = 0; idIndex < Videos.length; idIndex++){
            if(Videos[idIndex]['id'] == _videoid){
                console.log(_videoid + ' is already exist')
                Videos[idIndex]['translations'].push('jp')
                exist_sw = true
                break
            }
        }

        if(!exist_sw){
            await video_Push(_videoid, nowdata, 'jp')
            transcriptions_func(_videoid, nowdata)
        }

        translations_func_JP(_videoid, nowdata)
    }
}

async function refineData_CN(){
    console.log('----------------- refineData_CN -----------------')
    var nowdata = {}
    for(var index = 0; index < CN_Translation_Data.length; index++){
        nowdata = CN_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        if(_videoid == 'N')
            continue

        var exist_sw = false
        for(idIndex = 0; idIndex < Videos.length; idIndex++){
            if(Videos[idIndex]['id'] == _videoid){
                console.log(_videoid + ' is already exist')
                Videos[idIndex]['translations'].push('cn')
                exist_sw = true
                break
            }
        }

        if(!exist_sw){
            await video_Push(_videoid, nowdata, 'cn')
            transcriptions_func(_videoid, nowdata)
        }
        
        translations_func_CN(_videoid, nowdata)
    }
}

async function refineData_FR(){
    console.log('----------------- refineData_FR -----------------')
    var nowdata = {}
    for(var index = 0; index < ETC_Translation_Data.length; index++){
        nowdata = ETC_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        if(_videoid == 'N')
            continue
        
        var exist_sw = false
        for(idIndex = 0; idIndex < Videos.length; idIndex++){
            if(Videos[idIndex]['id'] == _videoid){
                console.log(_videoid + ' is already exist')
                Videos[idIndex]['translations'].push('fr')
                exist_sw = true
                break
            }
        }

        if(!exist_sw){
            await video_Push(_videoid, nowdata, 'fr')
            transcriptions_func(_videoid, nowdata)
        }
        
        translations_func_FR(_videoid, nowdata)
    }
}
async function refineData_ES(){
    console.log('----------------- refineData_ES -----------------')
    var nowdata = {}
    for(var index = 0; index < ETC_Translation_Data.length; index++){
        nowdata = ETC_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        if(_videoid == 'N')
            continue
        
        var exist_sw = false
        for(idIndex = 0; idIndex < Videos.length; idIndex++){
            if(Videos[idIndex]['id'] == _videoid){
                console.log(_videoid + ' is already exist')
                Videos[idIndex]['translations'].push('es')
                exist_sw = true
                break
            }
        }

        if(!exist_sw){
            await video_Push(_videoid, nowdata, 'es')
            transcriptions_func(_videoid, nowdata)
        }

        translations_func_ES(_videoid, nowdata)
    }
}
async function refineData_AR(){
    console.log('----------------- refineData_AR -----------------')
    var nowdata = {}
    for(var index = 0; index < ETC_Translation_Data.length; index++){
        nowdata = ETC_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        
        if(_videoid == 'N')
            continue
        var exist_sw = false
        for(idIndex = 0; idIndex < Videos.length; idIndex++){
            if(Videos[idIndex]['id'] == _videoid){
                console.log(_videoid + ' is already exist')
                Videos[idIndex]['translations'].push('ar')
                exist_sw = true
                break
            }
        }

        if(!exist_sw){
            await video_Push(_videoid, nowdata, 'ar')
            transcriptions_func(_videoid, nowdata)
        }

        translations_func_AR(_videoid, nowdata)
    }
}
async function refineData_VI(){
    console.log('----------------- refineData_VI -----------------')
    var nowdata = {}
    for(var index = 0; index < ETC_Translation_Data.length; index++){
        nowdata = ETC_Translation_Data[index]
        var _videoid = getVideoIDfromURL(nowdata['URL'][0])
        if(_videoid == 'N')
            continue
        var exist_sw = false
        for(idIndex = 0; idIndex < Videos.length; idIndex++){
            if(Videos[idIndex]['id'] == _videoid){
                console.log(_videoid + ' is already exist')
                Videos[idIndex]['translations'].push('vi')
                exist_sw = true
                break
            }
        }

        if(!exist_sw){
            await video_Push(_videoid, nowdata, 'vi')
            transcriptions_func(_videoid, nowdata)
        }
        
        translations_func_VI(_videoid, nowdata)
    }
}


async function video_Push(_videoid, nowdata, lang_code){
    console.log('GET videoid : ' + _videoid)
    
    try{
        var _videoDetail = await getYoutubeVideoDetail(_videoid)
        var _videoDetailSnippet = _videoDetail['items'][0]['snippet']
        var _videoDetailContent = _videoDetail['items'][0]['contentDetails']

        Videos.push({
            id: _videoid,
            channel: _videoDetailSnippet['channelId'],
            state: 0,
            metadata: {
                title: _videoDetailSnippet['title'],
                description: _videoDetailSnippet['description'],
                type : TranscriptionState[nowdata['진행 상황 (from 받아쓰기 + 자막 싱크)'][0]],
                url : 'https://youtu.be/' + _videoid,
                duration : getYoutubeVideoDuration(_videoDetailContent['duration']),
                uploadDate : _videoDetailSnippet['publishedAt'],
                deleted : false,
            },
            translations : [lang_code,]
        })
    }

    catch(e){
        console.log(e)
    }
}

function transcriptions_func(_videoid, nowdata){
    Transcriptions.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        caption : {
            caption_state : TranslationState_Metadata[nowdata['진행 상황']],
            caption_uploads : nowdata['한국어 자막파일'] == 'Null' ? false : true,
            caption_files : nowdata['한국어 자막파일'],
        },
        contributors : [],
        histories : [],
    })
}

function translations_func_EN(_videoid, nowdata){
    Translations_EN.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        metadata : {
            title : nowdata['제목 (영어 번역)'],
            description : nowdata['세부 정보 (영어 번역)'],
            state : TranslationState_Metadata[nowdata['진행 상황']],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : TranslationState_Metadata[nowdata['진행 상황']],
            files : nowdata['영어 자막 파일'],
        },
        contributors : [],
        histories : [],
    })
}

function translations_func_JP(_videoid, nowdata){
    Translations_JP.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        metadata : {
            title : nowdata['제목 (일본어 번역)'],
            description : nowdata['세부 정보 (일본어 번역)'],
            state : TranslationState_Metadata[nowdata['진행 상황']],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : TranslationState_Metadata[nowdata['진행 상황']],
            files : nowdata['일본어 자막 파일'],
        },
        contributors : [],
        histories : [],
    })
}

function translations_func_CN(_videoid, nowdata){
    Translations_CN.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        metadata : {
            title : nowdata['제목 (중국어 번역)'],
            description : nowdata['세부 정보 (중국어 번역)'],
            state : TranslationState_Metadata[nowdata['진행 상황']],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : TranslationState_Metadata[nowdata['진행 상황']],
            files : nowdata['중국어 자막 파일'],
        },
        contributors : [],
        histories : [],
    })
}

function translations_func_FR(_videoid, nowdata){
    Translations_FR.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        metadata : {
            title : nowdata['프랑스어 제목'],
            description : nowdata['프랑스어 세부 정보'],
            state : TranslationState_Metadata[nowdata['프랑스어 진행 상황']],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : TranslationState_Metadata[nowdata['진행 상황']],
            files : nowdata['프랑스어 자막 파일'],
        },
        contributors : [],
        histories : [],
    })
}

function translations_func_ES(_videoid, nowdata){
    Translations_ES.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        metadata : {
            title : nowdata['스페인어 제목'],
            description : nowdata['스페인어 세부 정보'],
            state : TranslationState_Metadata[nowdata['스페인어 진행 상황']],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : TranslationState_Metadata[nowdata['진행 상황']],
            files : nowdata['스페인어 자막 파일'],
        },
        contributors : [],
        histories : [],
    })
}

function translations_func_AR(_videoid, nowdata){
    Translations_AR.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        metadata : {
            title : nowdata['아랍어 제목'],
            description : nowdata['아랍어 세부 정보'],
            state : TranslationState_Metadata[nowdata['아랍어 진행 상황']],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : TranslationState_Metadata[nowdata['진행 상황']],
            files : nowdata['아랍어 자막 파일'],
        },
        contributors : [],
        histories : [],
    })
}

function translations_func_VI(_videoid, nowdata){
    Translations_VI.push({
        videoId : _videoid,
        state : TranslationState[nowdata['진행 상황']],
        metadata : {
            title : nowdata['베트남어 제목'],
            description : nowdata['베트남어 세부 정보'],
            state : TranslationState_Metadata[nowdata['베트남어 진행 상황']],
            url : 'https://youtu.be/' + _videoid,
        },
        caption : {
            state : TranslationState_Metadata[nowdata['진행 상황']],
            files : nowdata['베트남어 자막 파일'],
        },
        contributors : [],
        histories : [],
    })
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
    await refineData_JP()
    await refineData_CN()
    await refineData_FR()
    await refineData_ES()
    await refineData_AR()
    await refineData_VI()

    console.log('------Write to JSON file------')

    await fs.writeFile('./RefinedData/Videos.json', JSON.stringify(Videos, null, '\t'))
    await fs.writeFile('./RefinedData/Transcriptions.json', JSON.stringify(Transcriptions, null, '\t'))
    await fs.writeFile('./RefinedData/Translations_EN.json', JSON.stringify(Translations_EN, null, '\t'))
    await fs.writeFile('./RefinedData/Translations_JP.json', JSON.stringify(Translations_JP, null, '\t'))
    await fs.writeFile('./RefinedData/Translations_CN.json', JSON.stringify(Translations_CN, null, '\t'))
    await fs.writeFile('./RefinedData/Translations_FR.json', JSON.stringify(Translations_FR, null, '\t'))
    await fs.writeFile('./RefinedData/Translations_ES.json', JSON.stringify(Translations_ES, null, '\t'))
    await fs.writeFile('./RefinedData/Translations_AR.json', JSON.stringify(Translations_AR, null, '\t'))
    await fs.writeFile('./RefinedData/Translations_VI.json', JSON.stringify(Translations_VI, null, '\t'))
}
main()
//test()

async function test(){
    
}