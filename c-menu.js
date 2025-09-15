const path = require("path")
const fs = require("fs")
const folderPath = process.argv[2]
const configData = __dirname + "/resources/config.json"

if (!configData) { alert("Nenhuma configuração encontrada!") }

function getDay() {
    let currentDay = date.getDate()

    if (currentDay < 10) {
        currentDay = `0${String(currentDay)}`
    }

    return currentDay
}

function getMonth() {
    let currentMonth = date.getMonth()

    let MONTHS = [
        "JANEIRO",
        "FEVEREIRO",
        "MARÇO",
        "ABRIL",
        "MAIO",
        "JUNHO",
        "JULHO",
        "AGOSTO",
        "SETEMBRO",
        "OUTUBRO",
        "NOVEMBRO",
        "DEZEMBRO"
    ]

    if (MONTHS[currentMonth]) {
        currentMonth = MONTHS[currentMonth]
    }

    return currentMonth
}

function getYear() { return String(date.getFullYear()) }

function newFolderSelect(folder) {

    const div = document.createElement("div")
    const p = document.createElement("p")
    const radio = document.createElement("input")

    radio.type = "radio"
    p.innerHTML = folder.name
    if (folder.requireDate) { p.innerHTML += `(${getDay()}-${getMonth()}-${getYear()})` }

    div.append(radio, p)
    document.querySelector("main").appendChild(div)
}

function start() {

    const configDataJson = JSON.parse(fs.readFileSync(configData))
    console.log(configDataJson)
    configDataJson.folders.forEach(folder => {
        newFolderSelect(folder)
    })
}

start()