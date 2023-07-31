const {app, BrowserWindow, screen } = require("electron");

const path = require("path");

let win1;
let win2;

function ventana2() {
  win1 = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win1.setMenuBarVisibility(false);
  win1.setFullScreen(true);
  win1.loadFile("error.html");
}

function ventana() {
  win2 = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win2.setMenuBarVisibility(false);
  win2.setFullScreen(true);
  win2.loadFile("index.html");
}


app.whenReady().then(() => {

  const display = screen.getAllDisplays();
  const externalDisplay =display.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  console.log("pantalla externa:",externalDisplay)
 // console.log(display);
  if (display.length == 2) {
    /*creamos las 2 pantallas*/
    ventana();
    if (externalDisplay) {
      win = new BrowserWindow({
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50
      })
      win.setMenuBarVisibility(false);
      win.setFullScreen(true)
      win.loadURL('https://github.com');
    }

    console.log("2 pantallas");
  } else {

    ventana2();
    setTimeout(() => {
      app.quit();
    }, 6000);
    console.log("solo hay una pantalla");
    /*vista que necesita 2 pantallas llamara a tecnologia*/

  }

  intervalos();

});

function intervalos(){

  setInterval(() => {

    const display = screen.getAllDisplays();
    const externalDisplay = display.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    });
  
    if (externalDisplay) {
   
      console.log("pantalla encontrada");

    } else {
       
      console.log("no se encuentra la pnatalla");
      win = new BrowserWindow({
        width: 1000,
        height: 1000,
      })
       win.setMenuBarVisibility(false);
       win.setFullScreen(true);
       win.loadFile("conexion.html");
       setTimeout(()=>{
     
        app.quit();
  
      },7000)
  
    }

  }, 8000);


}


