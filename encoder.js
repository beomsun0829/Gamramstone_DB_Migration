const fs = require('fs');
const fetch = require('node-fetch');

const { env } = process;
require('dotenv').config()

var Videos = []
var Transcriptions = []
var Translations_EN = []
var Translations_JP = []
var Translations_CN = []
var Translations_FR = []
var Translations_ES = []
var Translations_AR = []
var Translations_VI = []

async function readFiles(){
    Videos = await fs.readFileSync('./RefinedData/Videos.json', 'utf8')
    Videos = JSON.parse(Videos)
    Transcriptions = await fs.readFileSync('./RefinedData/Transcriptions.json', 'utf8')
    Transcriptions = JSON.parse(Transcriptions)
    Translations_EN = await fs.readFileSync('./RefinedData/Translations_EN.json', 'utf8')
    Translations_EN = JSON.parse(Translations_EN)
    Translations_JP = await fs.readFileSync('./RefinedData/Translations_JP.json', 'utf8')
    Translations_JP = JSON.parse(Translations_JP)
    Translations_CN = await fs.readFileSync('./RefinedData/Translations_CN.json', 'utf8')
    Translations_CN = JSON.parse(Translations_CN)
    Translations_FR = await fs.readFileSync('./RefinedData/Translations_FR.json', 'utf8')
    Translations_FR = JSON.parse(Translations_FR)
    Translations_ES = await fs.readFileSync('./RefinedData/Translations_ES.json', 'utf8')
    Translations_ES = JSON.parse(Translations_ES)
    Translations_AR = await fs.readFileSync('./RefinedData/Translations_AR.json', 'utf8')
    Translations_AR = JSON.parse(Translations_AR)
    Translations_VI = await fs.readFileSync('./RefinedData/Translations_VI.json', 'utf8')
    Translations_VI = JSON.parse(Translations_VI)
}


async function main(){
    await readFiles()
}

main()