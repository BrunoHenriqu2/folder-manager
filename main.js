const { ipcMain, dialog, app, BrowserWindow } = require("electron")
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
}

if (folderPath) { return newWindow("context-menu.html", 500, 400) }

newWindow("folder-manager.html", 800, 600)