const { ipcMain, dialog, app, BrowserWindow } = require("electron")
const path = require("path")
const fs = require("fs")
const folderPath = process.argv[2]

function newWindow(name, width, height) {
    app.whenReady().then(() => {
        const win = new BrowserWindow({
            width: width || 600,
            height: height || 500,
            focusable: true,
            webPreferences: {
                nodeIntegration: true, // para lidar tanto com back como front-end em um unico script, caso seja necessario.
                contextIsolation: false
            }
        })

        try { win.loadFile(name) } catch (err) { return console.log(err) }
    })

    ipcMain.on("close-app", () => app.quit())
    ipcMain.on("show-msg", (e, object) => dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), object))
    ipcMain.handle("get-user-data", (e) => {
        try {
            return JSON.parse(fs.readFileSync(app.getPath("userData") + "/config.json"))
        } catch(err) {  console.log(err); return {err: toString(err)} }
    })
    ipcMain.on("set-user-data", (e, oldDataObject, dataObject) => {
        if (typeof dataObject !== "string") {dataObject = JSON.stringify(dataObject)}
        if (typeof oldDataObject !== "string") {oldDataObject = JSON.stringify(oldDataObject)}

        const userDataPath = app.getPath("userData")
        const configFilePath = path.join(userDataPath, "config.json")
        const configBakFilePath = path.join(userDataPath, "config-bak.json")
        
        // cria um backup do arquivo antigo (por segurança) e cria o novo
        fs.writeFileSync(configBakFilePath, oldDataObject)
        fs.writeFileSync(configFilePath, dataObject)
    })
}

if (folderPath) { return newWindow("context-menu.html", 500, 400) }

newWindow("folder-manager.html", 800, 600)