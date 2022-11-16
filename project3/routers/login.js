const express = require('express');
const routerLogin = express.Router();
const bcryptjs = require('bcryptjs'); //MODULO PARA ENCRIPTAR LA CONTRASEÑA
const connection = require('../database/db');//MODULO PARA CONECTARSE A LA BASE DE DATOS


routerLogin.get('/login',(req,res)=>{
    res.render('login')
})

// Valida que el usuario exista y lo autentifica en la aplicacion
routerLogin.post('/auth',async(req,res)=>{
    const user = req.body.user;
    const pass = req.body.password;
    let passwordHash = await bcryptjs.hash(pass,8)
    if (user && pass) {
        connection.query('SELECT * FROM user WHERE user =?',[user],async (err,results)=>{
            if (results.length == 0 || !(await bcryptjs.compare(pass,results[0].pass))) {
                res.render('login',{
                    alert:true,
                    alertTitle:'Error',
                    alertMessage:'Usuario y/o password incorrectas !',
                    alertIcon:'error',
                    showConfirmButton:true,
                    timer:false,
                    ruta:'login'
                })
            }else{
                req.session.loggedin = true
                req.session.name = results[0].name
                req.session.rol = results[0].rol
                res.render('login',{
                    alert:true,
                    alertTitle:'Conexion exitosa',
                    alertMessage:'Login correcto !',
                    alertIcon:'success',
                    showConfirmButton:false,
                    timer:1500,
                    ruta:''
                })
            }
        })
    }else{
        res.render('login',{
            alert:true,
            alertTitle:'Advertencia !',
            alertMessage:'Por favor ingrese un usuario y/o password !',
            alertIcon:'warning',
            showConfirmButton:true,
            timer:false,
            ruta:'login'
        })
    }
})


//11 Valida que el usuario este logeado antes de poder entrar a la pagina correspondiente
routerLogin.get('/',(req,res)=>{
    if (req.session.loggedin) {
     
    if (req.session.rol === 'admin') {

        connection.query('SELECT * FROM user',(err,results)=>{
            if (err) {
                throw err;
            }else{
                res.render('index',{
                    login:true,
                    name:req.session.name,
                    rol:req.session.rol,
                    results:results
                }) 

            }
        })

        
    }

    if (req.session.rol === 'cliente') {
        res.render('index',{
            login:true,
            name:req.session.name,
            rol:req.session.rol
        })  
    }
      
        
    }else{
        res.render('index',{
            login:false,
            name:'Debes iniciar sesion antes de entrar a esta pagina :)'
        })
    }
})


//Destruye la sesion del usuario
routerLogin.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

module.exports = routerLogin;