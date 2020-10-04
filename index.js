const electron = require('electron');
const { app,BrowserWindow, Menu } = electron;


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.loadFile('index.html');
    
    // win.webContents.openDevTools();
};

app.on('ready',() => {
    createWindow();
})





