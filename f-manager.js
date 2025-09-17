const { ipcRenderer } = require("electron")
const fs = require("fs")
const path = require('path')
let defaultConfig = {
    "folders": [
        {
            "name": "Nome padrão 2",
            "requireDate": false,
            "subfolders": [
                {
                    "name": "Teste123",
                    "requireAssignature": true
                }
            ]

        }
    ]
}

const create = {

    newFolder(folderName, requireDate, subfolders) {
        const div = document.createElement("div")
        const input = document.createElement("input")

        const checkBox = document.createElement("input")
        const label = document.createElement("label")
        const newSubfolderButton = document.createElement("button")

        const _delete = document.createElement("button")

        _delete.innerHTML = "X"
        _delete.addEventListener("click", () => div.remove())

        checkBox.type = "checkbox"
        checkBox.checked = requireDate || false
        checkBox.className = "require-checkbox"
        label.innerHTML = "Colocar data?"

        input.type = "text"
        input.className = "folder-name"
        input.value = folderName || ""

        newSubfolderButton.className = "new-subfolder"
        newSubfolderButton.innerHTML = "Nova subpasta"
        newSubfolderButton.addEventListener("click", () => this.newSubfolder(undefined, undefined, div))

        div.className = "folder"
        div.id = folderName || ""

        label.appendChild(checkBox)
        div.append(_delete, input, label, newSubfolderButton)

        if (subfolders) {
            subfolders.forEach(subfolder => {
                this.newSubfolder(subfolder.name, subfolder.requireAssignature, div)
            })
        }

        document.querySelector("#folders").appendChild(div)

        return div
    },

    newSubfolder(folderName, requireAssignature, parentNode) {
        const div = document.createElement("div")
        const _delete = document.createElement("button")
        const input = document.createElement("input")
        const checkBox = document.createElement("input")
        const label = document.createElement("label")

        div.className = "subfolder"
        div.id = folderName

        _delete.innerHTML = "X"
        _delete.addEventListener("click", () => div.remove())

        input.type = "text"
        label.innerHTML = "requer assinatura?"
        checkBox.type = "checkbox"
        checkBox.className = "require-checkbox"

        input.value = folderName || ""
        input.className = "folder-name"
        checkBox.checked = requireAssignature || false

        label.appendChild(checkBox)
        div.append(_delete, input, label)
        if (parentNode) { parentNode.appendChild(div) }

        return div
    }
}

function start() {
    const configPath = __dirname + "/config.json"

    const newFolderButton = document.querySelector("#new-folder")
    newFolderButton.addEventListener("click", () => create.newFolder())

    const saveButton = document.querySelector("#save")
    saveButton.addEventListener("click", () => {
        const configJson = JSON.parse(fs.readFileSync(configPath, "utf8"))

        const newFolderConfig = []
        const newSubFoldersConfig = []

        // criando o arquivo na pasta "temp" primeiro
        fs.copyFileSync(configPath, __dirname + "/config-bak.json")

        // alterando organizacao das pastas
        document.querySelectorAll(".folder").forEach(folder => {
            const inputValue = folder.querySelector("input.folder-name").value
            const requireDate = folder.querySelector("input.require-checkbox").checked
            const subFolders = folder.querySelectorAll("input.subfolder")

            subFolders.forEach(subfolder => {
                newSubFoldersConfig.push({
                    name: subfolder.querySelector("input.folder-name").value,
                    requireAssignature: subfolder.querySelector("input.require-checkbox").checked
                })
            })

            newFolderConfig.push({
                name: inputValue,
                requireDate: requireDate,
                subfolders: newSubFoldersConfig
            })
        })

        // alterando apenas o objeto "folders" em configJson, caso eu va usar outros tipos de configuracoes (provavelmente nao)
        configJson.folders = newFolderConfig

        // escrevendo uma nova configuracao que pega como valor configJson modificado
        fs.writeFileSync(__dirname + "/config.json", JSON.stringify(configJson))

        ipcRenderer.send("show-msg", {
            type: "info",
            title: "Mensagem",
            message: "Todas as alterações foram salvas!",
            buttons: ["OK"]
        })
    })

    /* config.json load */

    if (!fs.existsSync(configPath)) {
        if (fs.existsSync(__dirname + "/default-config.json")) {
            defaultConfig = JSON.parse(fs.readFileSync(__dirname + "/default-config.json", "utf8"))
        }

        fs.writeFileSync(configPath, JSON.stringify(defaultConfig))
    }

    // so.. load folders!
    const configJson = JSON.parse(fs.readFileSync(configPath, "utf8"))
    
    configJson.folders.forEach(folder => {
        create.newFolder(folder.name, folder.requireDate, folder.subfolders)
    })
}

start()