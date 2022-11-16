const express = require('express');
const routerUpdate = express.Router();
const connection = require('../database/db');//MODULO PARA CONECTARSE A LA BASE DE DATOS

routerUpdate.get("/update", (req, res) => {
  if (!req.session.loggedin) {
    res.render("update",{
        login:false,
        name:'Error 404, la direccion a la que intenta entrar no se cuentra disponible :('
    });
  }else{
    res.render("update",{
        login:false,
        name:'Error 404'       
    });
    req.session.destroy()    
  }
});


//RUTA QUE MUESTRA EL USUARIO A EDITAR Y SE ENCARGA DE VALIDAR LOS PERMISOS DE ACCESO A CADA PANTALLA
routerUpdate.get('/update/:id',(req,res)=>{
    if (req.session.loggedin) {
        if (req.session.rol === 'admin') {
            const id = req.params.id;
            connection.query('SELECT * FROM user WHERE id=?',[id],(err,results)=>{
                if (err) {
                    throw err
                }else{         
                    res.render('update',{user:results[0],login:true,rol:req.session.rol})
                }
            })           
        }
            if (req.session.rol === 'cliente') {
                res.render('update',{
                    login:true,
                    name:req.session.name,
                    rol:req.session.rol
                })  
        }

        
    }
    else{
        res.render('update',{
            login:false,
            name:'Error 404, la direccion a la que intenta entrar no se cuentra disponible :('
        })
    }
   
})

//RUTA PARA APLICAR LOS CAMBIOS AL USUARIO SELECCIONADO
routerUpdate.post('/updates',(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const rol = req.body.rol;
    connection.query('UPDATE user SET ? WHERE id =?',[{name:name,rol:rol},id],(err,result)=>{
        if (err) {
            throw err
        }else{
         
            res.redirect('/')
        }
    })

})

//RUTA PARA ELIMINAR UN USUARIO
routerUpdate.get('/delete/:id',(req,res)=>{
    const id = req.params.id;
    connection.query('DELETE FROM user WHERE id =?',[id],(err,results)=>{
        if (err) {
            throw err
        }else{
            res.redirect('/')
        }
    })
})

//Destruye la sesion del usuario
routerUpdate.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })    
})



module.exports = routerUpdate;