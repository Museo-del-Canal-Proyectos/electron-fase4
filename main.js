// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu,open} = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let mainWindow1;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    fullscreen: true,
   // width: 1600,
   // height: 800,
    audio: true,
    video:true,
    
    webPreferences: {
     
      webSecurity: false
    }
    
    
  });
  //manejar tamaño   
  mainWindow.setMenuBarVisibility(false);
  // and load the index.html of the app.http://172.16.12.30:8000/php artisan serve --host=172.16.12.30 --port=8000
  //mainWindow.loadURL("http://video-booth.com/vistaprincipal");
  mainWindow.loadFile('index.html');
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

//segunda ventana Inicio
function createWindow1() {
  // Create the browser window.
  mainWindow1 = new BrowserWindow({
    fullscreen: true,
   // width: 1600,
   // height: 800,
    audio: true,
    video:true,
    
    webPreferences: {
     
      webSecurity: false
    }
    
    
  });
  //manejar tamaño   
  mainWindow1.setMenuBarVisibility(false);
  // and load the index.html of the app.http://172.16.12.30:8000/php artisan serve --host=172.16.12.30 --port=8000
  mainWindow1.loadURL("http://localhost/video-booth/public/");
  //mainWindow.loadFile('index.html');
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
    mainWindow.close();
  // Emitted when the window is closed.
  mainWindow1.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow1 = null;
  });
}


setTimeout(createWindow1,7000);

//final de segunda ventana

function createMainMenu() {
  const Navegar = [
    {
      label: "Lists",
      submenu: [
        {
          label: "Create new list",
          accelerator: "CommandOrControl+N",
          click() {
            mainWindow.webContents.send("create-list");
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  //createMainMenu();
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
