const express = require('express')
const dotenv = require('dotenv')
const cookiParser= require('cookie-parser')

const app = express()

//Plantlla
app.set("view engine","ejs")

//Para trabajar con las cookies
app.use(cookiParser())


//Carpeta de recursos estaticos
app.use(express.static('public'))

//Para procesar datos
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Variables de entorno
dotenv.config({path:'./env/.env'})


//Router
app.use('/',require('./routes/router'))

//Para eliminar el cache y que no se pueda volver cuando hacemos logut
app.use(function(req,res,next) {
    if (!req.user) {
        res.header('Cache-Control','Private, no-cache ,no-store ,must-revalidate')
        next();
    }
    
})

const PORT = 3001

app.listen(PORT, ()=>{
    console.log("EL SERVER ESTA FUNCIONANDO POR EL PUERTO 3001")
})
