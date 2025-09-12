const { app, BrowserWindow } = require('electron')
const path = require('path')

const create = {
    newWindow() {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
        })

        win.loadFile('index.html')
    },
}

function start() {
    app.whenReady().then(() => {
        create.newWindow()

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                create.createWindow()
            }
        })


    })
}

start()