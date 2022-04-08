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

/*
테이블 구조가 조금 모시깽한데
영어 번역, 일본어 번역, 중국어 번역 테이블 + 기타 언어 번역 테이블에 있는 레코드 정보랑
레코드 중에 자막 파일 달려 있는거는 파일 다운로드해서 서버 files 테이블에 따로 추가해야 합니다
*/


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
const EN_Translation_Key = ["제목", "받아쓰기 + 자막 싱크", "진행 상황 (from 받아쓰기 + 자막 싱크)",
"영상 분류", "채널", "세부 정보", "URL", "제목 (from 받아쓰기 + 자막 싱크)", "한국어 자막파일",
"영어 스크립트 (업데이트 X)", "영어 자막 파일", "진행 상황", "현재 담당", "제목 (영어 번역)",
"세부 정보 (영어 번역)", "업로드 날짜", "Last Modified", "관"]

async function Get_EN_Translation(){
    console.log('----Getting English Translation----')
    EN_Translation_Data = []

    //get airtable base data Asynchronous 
    const base = await AirtableBase('영어 번역')
    const records = await base.select({
        view: "현황판"
    }).all()
    //console.log(records)
    for (let i = 0; i < records.length; i++) {
        Now_Data = {}
        for (let j = 0; j < EN_Translation_Key.length; j++) {
            if(records[i].get(EN_Translation_Key[j]) != null)
                Now_Data[EN_Translation_Key[j]] = records[i].get(EN_Translation_Key[j])
            else
                Now_Data[EN_Translation_Key[j]] = "Null"
        }
        EN_Translation_Data[i] = Now_Data
    }
    Save_To_JSON(EN_Translation_Data, 'EN_Translation')
}


//일본어 번역
const JP_Translation_Key = ["제목", "받아쓰기 + 자막 싱크", "진행 상황 (from 받아쓰기 + 자막 싱크)",
"영상 분류", "채널", "세부 정보", "URL", "제목 (from 받아쓰기 + 자막 싱크)", "한국어 자막파일",
"일본어 스크립트 (업데이트 X)", "일본어 자막 파일", "진행 상황", "현재 담당", "제목 (일본어 번역)",
"세부 정보 (일본어 번역)", "업로드 날짜", "Last Modified", "관"]

async function Get_JP_Translation(){
    console.log('----Getting Japanese Translation----')
    JP_Translation_Data = []

    //get airtable base data Asynchronous 
    const base = await AirtableBase('일본어 번역')
    const records = await base.select({
        view: "현황판"
    }).all()
    //console.log(records)
    for (let i = 0; i < records.length; i++) {
        Now_Data = {}
        for (let j = 0; j < JP_Translation_Key.length; j++) {
            if(records[i].get(JP_Translation_Key[j]) != null)
                Now_Data[JP_Translation_Key[j]] = records[i].get(JP_Translation_Key[j])
            
            else
                Now_Data[JP_Translation_Key[j]] = "Null"

        }
        JP_Translation_Data[i] = Now_Data
    }
    Save_To_JSON(JP_Translation_Data, 'JP_Translation')
}


//중국어 번역
const CN_Translation_Key = ["제목", "받아쓰기 + 자막 싱크", "진행 상황 (from 받아쓰기 + 자막 싱크)",
"영상 분류", "채널", "세부 정보", "URL", "제목 (from 받아쓰기 + 자막 싱크)", "한국어 자막파일",
"중국어 자막 파일", "진행 상황", "현재 담당", "제목 (중국어 번역)", "세부 정보 (중국어 번역)",
"업로드 날짜", "Last Modified", "관", "업로드 준비 2"]

async function Get_CN_Translation(){
    console.log('----Getting Chinese Translation----')
    CN_Translation_Data = []

    //get airtable base data Asynchronous 
    const base = await AirtableBase('중국어 번역')
    const records = await base.select({
        view: "현황판"
    }).all()
    //console.log(records)
    for (let i = 0; i < records.length; i++) {
        Now_Data = {}
        for (let j = 0; j < CN_Translation_Key.length; j++) {
            if(records[i].get(CN_Translation_Key[j]) != null)
                Now_Data[CN_Translation_Key[j]] = records[i].get(CN_Translation_Key[j])
            
            else
                Now_Data[CN_Translation_Key[j]] = "Null"
            
        }
        CN_Translation_Data[i] = Now_Data
    }
    Save_To_JSON(CN_Translation_Data, 'CN_Translation')
}


//기타 언어 변역
const ETC_Translation_Key = ["제목", "받아쓰기 + 자막 싱크", "진행 상황 (from 받아쓰기 + 자막 싱크)",
"영상 분류", "채널", "세부 정보", "URL", "제목 (from 받아쓰기 + 자막 싱크)", "한국어 자막파일",
"프랑스어 진행 상황", "프랑스어 현재 담당", "프랑스어 제목", "프랑스어 세부 정보", "프랑스어 자막 파일",
"스페인어 진행 상황", "스페인어 현재 담당", "스페인어 제목", "스페인어 세부 정보", "스페인어 자막 파일",
"아랍어 진행 상황", "아랍어 현재 담당", "아랍어 제목", "아랍어 세부 정보", "아랍어 자막 파일",
"베트남어 진행 상황", "베트남어 현재 담당", "베트남어 제목", "베트남어 세부 정보", "베트남어 자막 파일",
"업로드 날짜", "Last Modified", "업로드 준비", "업로드 준비 2"]

async function Get_ETC_Translation(){
    console.log('----Getting ETC Translation----')
    ETC_Translation_Data = []

    //get airtable base data Asynchronous 
    const base = await AirtableBase('기타 언어 번역')
    const records = await base.select({
        view: "마스터"
    }).all()
    //console.log(records)
    for (let i = 0; i < records.length; i++) {
        Now_Data = {}
        for (let j = 0; j < ETC_Translation_Key.length; j++) {
            if(records[i].get(ETC_Translation_Key[j]) != null)
                Now_Data[ETC_Translation_Key[j]] = records[i].get(ETC_Translation_Key[j])
            
            else
                Now_Data[ETC_Translation_Key[j]] = "Null"
            
        }
        ETC_Translation_Data[i] = Now_Data
    }
    Save_To_JSON(ETC_Translation_Data, 'ETC_Translation')
}






main()

function main(){
    Get_EN_Translation()
    Get_JP_Translation()
    Get_CN_Translation()
    Get_ETC_Translation()
}
