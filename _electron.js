const { app, BrowserWindow } = require('electron')

module.exports = {
    newWindow(name) {
        app.whenReady().then(() => {
            const win = new BrowserWindow({
                width: 600,
                height: 500,
                focusable: true,
                webPreferences: {
                    nodeIntegration: true, // para lidar tanto com back como front-end em um unico script, caso seja necessario.
                    contextIsolation: false
                }
            })

            try { win.loadFile(name) } catch (err) { return console.log(err) }
        })
    },
}