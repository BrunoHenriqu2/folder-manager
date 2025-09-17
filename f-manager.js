const { ipcRenderer } = require("electron")

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

async function start() {
    let userData = await ipcRenderer.invoke("get-user-data")

    const newFolderButton = document.querySelector("#new-folder")
    newFolderButton.addEventListener("click", () => create.newFolder())

    const saveButton = document.querySelector("#save")
    saveButton.addEventListener("click", () => {
        const newFolderConfig = []
        
        console.log(userData)

        // alterando organização das pastas
        document.querySelectorAll(".folder").forEach(folder => {
            const inputValue = folder.querySelector("input.folder-name").value
            const requireDate = folder.querySelector("input.require-checkbox").checked
            const subFolders = folder.querySelectorAll(".subfolder") // provavelmente é uma div
            const newSubFoldersConfig = []
            
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
            console.log(newSubFoldersConfig, subFolders)
        })

        // alterando apenas o objeto "folders" em configJson, caso eu vá usar outros tipos de configuracoes (provavelmente nao)
        defaultJson.folders = newFolderConfig

        // escrevendo uma nova configuracao que pega como valor um configJson modificado apenas nas pastas
        ipcRenderer.send("set-user-data", defaultJson)

        ipcRenderer.send("show-msg", {
            type: "info",
            title: "Mensagem",
            message: "Todas as alterações foram salvas!",
            buttons: ["OK"]
        })
    })

    /* if userData exists then load folders */
    if (!userData.err) {
        userData.folders.forEach(folder => {
            create.newFolder(folder.name, folder.requireDate, folder.subfolders)
        })
    } else {userData = {}} // resete tudo essa bomba tbm se não existir
    console.log(userData)
}

start()