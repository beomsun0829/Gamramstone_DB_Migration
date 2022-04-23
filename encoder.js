const fs = require('fs');
const http = require('http');
const fetch = require('node-fetch');

const { env } = process;
require('dotenv').config()

const FileReader = require('filereader');

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


async function downloadFiles(){
    for(var i = 0; i < Transcriptions.length; i++){
        if(Transcriptions[i]["caption"]["caption_uploads"] == true){
            var captionfile = Transcriptions[i]["caption"]["caption_files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

    for(var i = 0; i < Translations_EN.length; i++){
        if(Translations_EN[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_EN[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

    for(var i = 0; i < Translations_JP.length; i++){
        if(Translations_JP[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_JP[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

    for(var i = 0; i < Translations_CN.length; i++){
        if(Translations_CN[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_CN[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

    for(var i = 0; i < Translations_FR.length; i++){
        if(Translations_FR[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_FR[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

    for(var i = 0; i < Translations_ES.length; i++){
        if(Translations_ES[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_ES[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

    for(var i = 0; i < Translations_AR.length; i++){
        if(Translations_AR[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_AR[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

    for(var i = 0; i < Translations_VI.length; i++){
        if(Translations_VI[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_VI[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                console.log("fetch " + captionfile[j]["url"])
                const request = await fetch(captionfile[j]["url"]);
                //download the file
                const file = fs.createWriteStream('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4));
                await request.body.pipe(file);
            }
        }
    }

}

//encode file to base64

async function encodeFiles(){
    for(var i = 0 ; i < Transcriptions.length; i ++){
        if(Transcriptions[i]["caption"]["caption_uploads"] == true){
            var captionfile = Transcriptions[i]["caption"]["caption_files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }

    for(var i = 0 ; i < Translations_EN.length; i ++){
        if(Translations_EN[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_EN[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }

    for(var i = 0 ; i < Translations_JP.length; i ++){
        if(Translations_JP[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_JP[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }

    for(var i = 0 ; i < Translations_CN.length; i ++){
        if(Translations_CN[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_CN[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }

    for(var i = 0 ; i < Translations_FR.length; i ++){
        if(Translations_FR[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_FR[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }

    for(var i = 0 ; i < Translations_ES.length; i ++){
        if(Translations_ES[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_ES[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }

    for(var i = 0 ; i < Translations_AR.length; i ++){
        if(Translations_AR[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_AR[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }

    for(var i = 0 ; i < Translations_VI.length; i ++){
        if(Translations_VI[i]["caption"]["files"] != "Null"){
            var captionfile = Translations_VI[i]["caption"]["files"]
            for(var j = 0; j < captionfile.length; j++){
                var file = fs.readFileSync('./Downloadfile/' + captionfile[j]["id"] + captionfile[j]["filename"].slice(-4))
                var base64data = new Buffer.from(file).toString('base64');
                captionfile[j]["base64"] = base64data
            }
        }
    }
        
}

async function writeFiles(){
    fs.writeFileSync('./EncodedData/Transcriptions.json', JSON.stringify(Transcriptions, null, 2))
    fs.writeFileSync('./EncodedData/Translations_EN.json', JSON.stringify(Translations_EN, null, 2))
    fs.writeFileSync('./EncodedData/Translations_JP.json', JSON.stringify(Translations_JP, null, 2))
    fs.writeFileSync('./EncodedData/Translations_CN.json', JSON.stringify(Translations_CN, null, 2))
    fs.writeFileSync('./EncodedData/Translations_FR.json', JSON.stringify(Translations_FR, null, 2))
    fs.writeFileSync('./EncodedData/Translations_ES.json', JSON.stringify(Translations_ES, null, 2))
    fs.writeFileSync('./EncodedData/Translations_AR.json', JSON.stringify(Translations_AR, null, 2))
    fs.writeFileSync('./EncodedData/Translations_VI.json', JSON.stringify(Translations_VI, null, 2))
}


async function main(){
    await readFiles()
    await downloadFiles()
    await encodeFiles()
    await writeFiles()
}

main()