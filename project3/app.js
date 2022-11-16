//1 invocamos express
const express = require('express');
const ejs = require('ejs')
const app = express();

//2 seteamos urlencoded para capturar datos en el formulario y no tener errores
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3 invocamos env
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'})

//4 invocamos bcryptjs
const bcryptjs = require('bcryptjs');

//5 Variable de sesion
const sesion = require('express-session')
app.use(sesion({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//6 Invocamos modulo de la base datos
const connection = require('./database/db');


//7 Recursos publicos
app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + 'public'));

//8 Creamos la plantilla 
app.set('view engine','ejs');

//Router de la pagina Login
const routerLogin = require('./routers/login.js')
app.use('/',routerLogin)

//Router de la pagina Registro
const routerRegister = require('./routers/register.js')
app.use('/',routerRegister)

//Router Update rol usuario
const routerUpdate = require('./routers/update.js')
app.use('/',routerUpdate)

//Puerto y ejecutando servidor
app.listen(3001, (req,res)=>{
    console.log('El servidor se esta ejecutando en local ...')
})

