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
var Translations_EN = {}



/*
class Video {
    id: String, // 영상 ID
    channel: String, // 영상 채널 ID
    state: Number, // 0: 열림 (수정 가능), 1: 잠금

    metadata: {
        title: String, // 영상 제목 (수정이 가능한 필드)
        description: String, // 영상 설명 (수정이 가능한 필드)
        type: Number,  // 영상 타입 (풀 영상, 노래, 일반, 기타 등등)
        url: String,// 영상 URL (수정 불가능)
        duration: Number, // 영상 길이
        uploadDate: Date, // 영상이 업로드 된 날짜
        deleted: Boolean, // 영상이 삭제됐는 지에 대한 여부 (수정이 가능한 필드)
    },

    translations : [],
}
*/

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
    console.log(EN_Translation_Data[0])
    for(var index = 0; index < EN_Translation_Data.length; index++){
        nowdata = EN_Translation_Data[index]

        var _videoid = getVideoIDfromURL(nowdata['URL'])
        if(Videos[_videoid])
            continue

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
                uploadDate :_videoDetailSnippet['publishedAt'],
                deleted : false,
            },
            translations : [en,]
        }

        if(EN_Translation_Data['한국어 자막파일'] != 'Null'){
            Transcriptions[_videoid] = {
                videoId : _videoid,
                state : -1,
                caption_state : -1,
                caption_uploads : -1,
                caption_files : EN_Translation_Data['한국어 자막파일'][0],
                contributors : [{}],
                histories : [],
            }
        }

        if(EN_Translation_Data['']){

        }
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
    refineData_EN()
}
//main()
test()

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