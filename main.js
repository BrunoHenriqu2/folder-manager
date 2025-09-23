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
    ipcMain.on("set-user-data", (e, dataObject) => {
        if (typeof dataObject !== "string") {dataObject = JSON.stringify(dataObject)}
        
        const userDataPath = path.dirname(app.getPath("exe")) // app.getPath("userData")
        const configFilePath = path.join(userDataPath, "config.json")
        
        fs.writeFileSync(configFilePath, dataObject)
    })
    ipcMain.on("set-user-data-backup", (e, dataObject) => {
        if (typeof dataObject !== "string") {dataObject = JSON.stringify(dataObject)}

        const userDataPath = path.dirname(app.getPath("exe")) // app.getPath("userData")
        const configBakFilePath = path.join(userDataPath, "config-bak.json")

        // cria um backup do arquivo
        fs.writeFileSync(configBakFilePath, dataObject)
    })
    ipcMain.on("mkdir", (e, path, options) => { fs.mkdirSync(path, options) })
    ipcMain.handle("get-user-data", (e) => {
        try {
            return JSON.parse(fs.readFileSync(path.dirname(app.getPath("exe")) + "/config.json"))
        } catch(err) {  console.log(err); return {err: toString(err)} }
    })
    ipcMain.handle("get-context-path", (e) => { return folderPath })
}

if (folderPath) { return newWindow("context-menu.html", 500, 400) }

newWindow("folder-manager.html", 800, 600)