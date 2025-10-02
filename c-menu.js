const { ipcRenderer } = require("electron")
const date = new Date

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

function newFolderSelect(folder, folderPath) {

    const div = document.createElement("div")
    const p = document.createElement("p")
    const radio = document.createElement("input")

    div.className = "radio-select"

    radio.type = "radio"
    radio.addEventListener("change", () => {
        ipcRenderer.send("mkdir", `${folderPath}/${p.innerText}/`)

        folder.subfolders.forEach(subfolder => {
            ipcRenderer.send("mkdir", `${folderPath}/${p.innerText}/${subfolder.name}/`)

            if (subfolder.requireAssignature) {
                ipcRenderer.send("mkdir", `${folderPath}/${p.innerText}/${subfolder.name}/Assinado/`)
                ipcRenderer.send("mkdir", `${folderPath}/${p.innerText}/${subfolder.name}/Pendente/`)
            }
        })

        ipcRenderer.send("show-msg", {
            type: "info",
            title: "Mensagem",
            message: "A pastas foram criadas!",
            buttons: ["OK"]
        })

        ipcRenderer.send("close-app")
    })

    p.innerHTML = folder.name
    if (folder.requireDate) { p.innerText += ` (${getDay()}-${getMonth()}-${getYear()})` }

    div.append(radio, p)
    document.querySelector("main").appendChild(div)
}

async function start() {
    const userData = await ipcRenderer.invoke("get-user-data")
    const folderPath = await ipcRenderer.invoke("get-context-path")

    console.log(userData, folderPath)
    if (userData.err || !userData || !folderPath) {
        ipcRenderer.send("show-msg", {
            type: "error",
            title: "Erro",
            message: "Nenhuma configuração de pastas ou o caminho passado como argumento é inválido!",
            buttons: ["OK"]
        })
        ipcRenderer.send("close-app")
    }

    userData.folders.forEach(folder => {
        newFolderSelect(folder, folderPath)
    })
}

start()
