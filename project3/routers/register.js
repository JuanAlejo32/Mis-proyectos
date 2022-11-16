const express = require('express');
const routerRegister = express.Router();
const bcryptjs = require('bcryptjs'); //MODULO PARA ENCRIPTAR LA CONTRASEÑA
const connection = require('../database/db');//MODULO PARA CONECTARSE A LA BASE DE DATOS


routerRegister.get('/register',(req,res)=>{
    res.render('register')
})


// pagina de registro
routerRegister.post('/register', async (req,res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.password;
    let passwordHash = await bcryptjs.hash(pass,8)
    connection.query('INSERT INTO user SET ?',{user:user,name:name,rol:rol,pass:passwordHash},async(error,result)=>{
        if (error) {
            console.log(error)
            return;
        }
        res.render('register',{
            alert:true,
            alertTitle:'Registro',
            alertMessage:'Registro exitoso !',
            alertIcon:'success',
            showConfirmButton:false,
            timer:1500,
            ruta:'login'
        })
    })

})

module.exports = routerRegister;