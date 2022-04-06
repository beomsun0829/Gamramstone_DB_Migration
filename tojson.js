const Airtable = require('airtable')
const fs = require('fs')

const mongoose = require('mongoose')

const fetch = require('node-fetch')
//const { hash, createHash } = require('blake3')
const { env } = require('process')
require('dotenv').config()


Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: env.AIRTABLE_API_KEY,
})

const AirtableBase = Airtable.base(env.AIRTABLE_BASE_ID)


//JSON 저장
function Save_To_JSON(data, filename){
    console.log('----Saving to JSON----')
    fs.exists(filename, function(exists){
        if(exists){
            fs.unlinkSync(filename)
        }
        fs.writeFileSync(`./JsonData/${filename}.json`, JSON.stringify(data, null, '\t'))
    })
}

//멤버 리스트
const MemberList_Data = ["왁물원 닉네임", "언어", "담당", "메인 담당 채널", "서브 담당 채널"]

function Get_MemberList(){
    console.log('----Getting Member List----')
    json_data = {}
    AirtableBase('멤버 리스트').select({
        view: "영어"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            for (let i = 0; i < MemberList_Data.length; i++) {
                if(record.get(MemberList_Data[i]) != null){
                json_data[MemberList_Data[i]] = record.get(MemberList_Data[i])
                }
                else{
                json_data[MemberList_Data[i]] = "null"
                }
            }
            console.log(json_data)
        });
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

//영어 번역
const English_Translation = ["제목", "받아쓰기 + 자막 싱크", "진행 상황 (from 받아쓰기 + 자막 싱크)",
"영상 분류", "채널", "세부 정보", "URL", "제목 (from 받아쓰기 + 자막 싱크)", "한국어 자막파일",
"영어 스크립트 (업데이트 X)", "영어 자막 파일", "진행 상황", "현재 담당", "제목 (영어 번역)",
"세부 정보 (영어 번역)", "업로드 날짜", "Last Modified", "관"]

function Get_English_Translation(){
    console.log('----Getting English Translation----')
    json_data = {}
    AirtableBase('영어 번역').select({
        view: "현황판"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            for (let i = 0; i < English_Translation.length; i++) {
                if(record.get(English_Translation[i]) != null){
                json_data[English_Translation[i]] = record.get(English_Translation[i])
                }
                else{
                json_data[English_Translation[i]] = "Null"
                }
            }
            console.log(json_data)
            
        });
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

//일본어 번역
const JP_Translation = ["제목", "받아쓰기 + 자막 싱크", "진행 상황 (from 받아쓰기 + 자막 싱크)",
"영상 분류", "채널", "세부 정보", "URL", "제목 (from 받아쓰기 + 자막 싱크)", "한국어 자막파일",
"일본어 스크립트 (업데이트 X)", "일본어 자막 파일", "진행 상황", "현재 담당", "제목 (일본어 번역)",
"세부 정보 (일본어 번역)", "업로드 날짜", "Last Modified", "관"]

async function Get_JP_Translation(){
    console.log('----Getting Japanese Translation----')
    JP_Translation_Data = {}

    //get airtable base data Asynchronous 
    const base = await AirtableBase('일본어 번역')
    const records = await base.select({
        view: "현황판"
    }).all()
    //console.log(records)
    for (let i = 0; i < records.length; i++) {
        Now_Data = {}
        for (let j = 0; j < JP_Translation.length; j++) {
            if(records[i].get(JP_Translation[j]) != null)
                Now_Data[JP_Translation[j]] = records[i].get(JP_Translation[j])
            
            else
                Now_Data[JP_Translation[j]] = "Null"
            
        }
        JP_Translation_Data[i] = Now_Data
    }
    Save_To_JSON(JP_Translation_Data, 'JP_Translation')
}



main()

function main(){
  //Get_English_Translation()
  Get_JP_Translation()
}
