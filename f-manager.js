const fs = require("fs")
const path = require('path')

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
        checkBox.checked = requireDate
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
        checkBox.checked = requireAssignature || ""

        label.appendChild(checkBox)
        div.append(_delete, input, label)
        if (parentNode) { parentNode.appendChild(div) }

        return div
    }
}

function start() {
    const configPath = __dirname + "/resources/config.json"

    const newFolderButton = document.querySelector("#new-folder")
    newFolderButton.addEventListener("click", () => create.newFolder())

    const saveButton = document.querySelector("#save")
    saveButton.addEventListener("click", () => {
        const configJson = JSON.parse(fs.readFileSync(configPath, "utf8"))

        const newFolderConfig = []
        const newSubFoldersConfig = []

        // criando o arquivo na pasta "temp" primeiro
        fs.copyFileSync(configPath, __dirname + "/resources/config-bak.json")

        // renomeando o nome do arquivo e alterando seu caminho de temp para resources
        //fs.renameSync(__dirname + "/temp/config.json", __dirname + "/resources/config-bak-json")

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
                requireAssignature: requireDate,
                subfolders: newSubFoldersConfig
            })
        })

        // alterando apenas o objeto "folders" em configJson, caso eu va usar outros tipos de configuracoes (provavelmente nao)
        configJson.folders = newFolderConfig

        // escrevendo uma nova configuracao que pega como valor configJson modificado
        fs.writeFileSync(__dirname + "/resources/config.json", JSON.stringify(configJson))

        alert("Todas as alterações foram salvas")
    })

    /* config.json load */

    if (fs.existsSync(configPath)) {
        // so.. load folders!

        const configJson = JSON.parse(fs.readFileSync(configPath, "utf8"))
        console.log(configJson)
        configJson.folders.forEach(folder => {
            create.newFolder(folder.name, folder.requireDate, folder.subfolders)
        })

        //alert("config.json exist!")
    }
}

start()