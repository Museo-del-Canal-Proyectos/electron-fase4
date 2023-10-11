const { app, BrowserWindow, screen } = require('electron')//Libreria Electron
const path = require("path");//Libreria para Cargar la ruta de archivos
const fs = require("fs");//Libreria para leer y Crear Archivos
//Pantalla Panel
let InterfazPanel;
//Pantalla Proyector
let InterfazProyector;
//Pantalla Sin conexion al Proyector
let InterfazSinConexion;
//Pantalla HDMI desconectado del Proyector
let desconectado;
/*variable bandera de tipo booleana para validar si encendio detectando el HDMI}
 Posterior Cambia su Valor si hay una desconexion*/
let verificar = false;
//Funcion Panel Levanta la Interfaz del Panel de Control
function Panel() {
    //Creando Ventana con propiedades
    InterfazPanel = new BrowserWindow({
        fullscreen: true,
        audio: true,
        video: true,
        webPreferences: {
            //Optimizando Renderizado cargando el archivo
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false
        }
    });
    //quitando Interfaz de Bar Menu
    InterfazPanel.setMenuBarVisibility(false);
    //Cargando Plantilla HTML
    InterfazPanel.loadFile('home/index.html');
    InterfazPanel.on("closed", function () {
        InterfazPanel = null;
    });
}
//Panel De no detectar Proyector al Iniciar Desconectado HDMI
function Desconexion() {
    //Creando Interfaz 
    InterfazSinConexion = new BrowserWindow({
        fullscreen: false,
        audio: true,
        video: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false
        }
    });
    // Quitamdo el menu Bar
    InterfazSinConexion.setMenuBarVisibility(false);
    //Maximizanco la ventana
    InterfazSinConexion.maximize();
    //Cargando el Archivo Html
    InterfazSinConexion.loadFile('error.html');
    //Validando si la Interfaz esta cerrada cambiando el valor y cerrandola en automatico
    InterfazSinConexion.on("closed", function () {
        InterfazSinConexion = null;
    });
}
// Funcion Proyector al detectar el Proyector se crea la Interfaz en el Proyector
function Proyector(externalDisplay) {
    // Creando ventana para Proyector
    InterfazProyector = new BrowserWindow({
        fullscreen: true,
        audio: true,
        video: true,
        /*externarlDisplay es un argumento que 
        recibe al detectar pantalla fijando las coordenadas
        en el centro del proyector ESTE ARGUMENTO OTRA FUNCION QUE LO ACTIVA EN
        ESTE CASO ESPERA PARAMETRO PARA CREAR 
        */
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false
        }
    });
    //quitando menu Bar
    InterfazProyector.setMenuBarVisibility(false);
    //Cargando HTML que va en el Proyector
    InterfazProyector.loadFile('proyector/index.html');
    //Validando estado de Interfaz si es cerrada en proyector
    InterfazProyector.on("closed", function () {
        InterfazProyector = null;
    });
}
//Funcion para  crear vista si se desconecta el HDMI de Proyector
function Conexion() {
    // creando Interfaz de vista
    desconectado = new BrowserWindow({
        audio: true,
        video: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false
        }
    });
    //quitando menu Bar
    desconectado.setMenuBarVisibility(false);
    // maximizando pantalla
    desconectado.maximize();
    // Cargando HTML
    desconectado.loadFile('conexion.html');
    //Validando estado de ventana
    desconectado.on("closed", function () {
        desconectado = null;
    });
}
//Funcion deteccion de entradas HDMI 
function DeteccionEntradas() {
    //Constante que obtine la cantidad de entradas disponibles
    const display = screen.getAllDisplays();
    const externalDisplay = display.find((display) => {
        //Retornamos las coordenadas y validamos  pantalla externa o proyector en este caso
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    //validamos si el numero de pantalla son igual a dos para enviar las vistas de panel y proyector
    if (display.length == 2) {
        Panel();
        if (externalDisplay) {
            Proyector(externalDisplay);
        }
    } else {
        //La bandera se pone en true y despliega todo correcto en caso contrario saldria la vista que no se encontro proyector
        verificar = true;
        Desconexion();
    }
}
//Funcion de validacion que todo se desplego correctamente en caso de no cerrar 
function ValidandoPantalla() {
    //Constante que obtine la cantidad de entradas disponibles
    const cantidadPantallas = screen.getAllDisplays();
    const externalDisplay = cantidadPantallas.find((display) => {
        //Retornamos las coordenadas y validamos  pantalla externa o proyector en este caso
        return display.bounds.x !== 0 || display.bounds.y !== 0
    });
    //Validamos si hay entrada externa Proyector
    if (!externalDisplay) {
        //verificamos si hay un cambio en la bandera si todo inicio correctamente en casocontrario cierra las vistas y abre la de error de conexion
        if (!verificar) {
            //Usamos un try catch para captura y mejor manejo de errores
            try {
                //Cerramos 
                InterfazPanel.close();
                InterfazProyector.close();
                //abrimos vista de fallo de conexion  
                Conexion();
                //Limpiamos el Intervalo poniento stop a esta funcion que se repite cada  7s para verificar la señal del proyector
                clearInterval(this);
            } catch (error) {
                //Constante Fecha 
                const Fecha = new Date();
                //Contsante que captura el error con fecha
                const log = `Error :${error}.\nCreado el : ${Fecha.getDate()}`;
                //leemos el archivo  log de errores y obtenemos la informacion
                fs.readFile("./assets/Log/errores.log", "utf-8", (err, data) => {
                    const errorLectura = "Error de Lectura de Archivo: ";
                    if (err) {
                        //volvemos a escribir la informacion obtenida de los errores mas el error de lectura de archivo
                        fs.writeFileSync("./assets/Log/errores.log", `${errorLectura}${err}\n+${log}`);
                    } else {
                        //si no hay error de lectura se anexa el error nuevo 
                        fs.writeFileSync("./assets/Log/errores.log", `${data}\n${log}\n`);
                    }
                })
            }
        }
    }
}
//Creando vistas de electron  dentro de las funciones Llamadas 
app.on("ready", () => {
    DeteccionEntradas();
    //intervalo de funcion cada 7segundos
    setInterval(ValidandoPantalla, 3000);
});
// Si todas las ventas estan cerradas termina ejecucion de electron para 
app.on("window-all-closed", function () {
    //cerrando electron si todas las vistas fueron cerradas
    if (process.platform !== "darwin") {
        app.quit();
    }
});
//LEER ARCHIVOS
const tecnologia = fs.readFileSync(
    `${__dirname}/client/tecnologia.html`,
    "utf-8"
  );
///Servidor local
const express = require('express');
const ex = express();
const http = require("http");
const cors = require("cors");
//cors
ex.use(cors({ origin: true, credentials: true }));
const server = http.createServer(ex);
const { Server } = require("socket.io");
const io = new Server(server,{ cors: { origin: true, credentials: true } });
const bodyParser = require("body-parser");
//uso url con parametros
ex.use(express.urlencoded({ extended: true }));
//formato json en el express
ex.use(express.json());
//Body Parse
ex.use(bodyParser.urlencoded({ extended: true }));
ex.use(bodyParser.json());
//puerto
const PORT = process.env.PORT || 7000;
// Server - App
ex.get("/",(req, res) => {

  res.send("Servidor local corriendo Estable");

});
//Ruta
ex.get("/tecnologia",(req, res) => {
    res.writeHead(200, { "Content-Type": "text/html"});
    res.end(tecnologia);
  });

server.listen(PORT, () => {
  console.log("Servidor en ejecucion:" + PORT);

});

io.on("connection", (socket) => {
  //console.log("Socket - EXP: ", socket.id);
  //funcion escuha video
   video(socket);
   Home(socket);
   Portal(socket);
   Idioma(socket);
   Slider(socket);//SLIDER IMAGEN MAPA
   SliderImg(socket)//SLIDER IMG global
});

io.on("disconnected", () => {
  console.log("Fuera de service");
})

function video (socket){
  socket.on("video",(payload=String)=>{
  //console.log("video Recibido", payload);
   io.emit('video-nuevo',payload);
  });
}

function Home(socket){
  socket.on("home",(payload=String)=>{
    //console.log("home-recive",payload);
     io.emit('route',payload);
    });
}

function Portal(socket){
  socket.on("portal",(payload=String)=>{
    //console.log("portal: ", payload);
     io.emit('dataPortal',payload);
    });
}

function Idioma(socket){
    socket.on("langPost",(payload=String)=>{
     // console.log(payload);
      io.emit('langGet',payload);
    })
  }


  function Slider(socket){
    socket.on("slidenIn",(payload=String)=>{
      //console.log("Slide Img: ", payload);
      io.emit('slideOut',payload);
    })
  }

  function SliderImg(socket){
    socket.on("img-In",(payload=String)=>{
    //   console.log("Slide Img: ", payload);
      io.emit('img-Out',payload);
    })
  }
  
 












