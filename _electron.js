const { app, BrowserWindow, ipcMain, dialog } = require('electron')

module.exports = {
    newWindow(name, width, height) {
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
    },
}