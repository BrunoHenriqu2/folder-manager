const { ipcRenderer } = require("electron")
const path = require("path")
const fs = require("fs")
const date = new Date
const folderPath = process.argv[2]
const configData = __dirname + "/config.json"

if (!configData) {
    ipcRenderer.send("show-msg", {
        type: "error",
        title: "Erro",
        message: "Nenhuma configuração encontrada!",
        buttons: ["OK"]
    })
    ipcRenderer.send("close-app")
}

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

    div.className = "radio-select"

    radio.type = "radio"
    radio.addEventListener("change", () => {
        folder.subfolders.forEach(subfolder => {
            fs.mkdirSync(`/${folderPath}${p.innerText}/${subfolder.name}/`)

            if (subfolder.requireAssignature) {
                fs.mkdirSync(`/${folderPath}/${subfolder.name}/Assinado/`)
                fs.mkdirSync(`/${folderPath}/${subfolder.name}/Pendente/`)
            }

            ipcRenderer.send("show-msg", {
                type: "info",
                title: "Mensagem",
                message: "A pastas foram criadas!",
                buttons: ["OK"]
            })

            ipcRenderer.send("close-app")
        })
    })

    p.innerHTML = folder.name
    if (folder.requireDate) { p.innerText += ` (${getDay()}-${getMonth()}-${getYear()})` }

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