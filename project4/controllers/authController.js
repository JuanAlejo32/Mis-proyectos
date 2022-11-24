const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conection = require('../database/db')
const {promisify} = require('util')


//Metodo para registrarnos
exports.register = async(req,res)=>{

    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.password;
        let passHash = await bcryptjs.hash(pass, 8)      

        conection.query('INSERT INTO users SET ?',{user:user,name:name,pass:passHash},(err,results)=>{
            if (err) {
                console.log(err)
            }
            res.render('register',{
                alert:true,
                alertTitle:"Registro completado !",
                alertMessage:"Se a registrado exitosamente !",
                alertIcon:'success',
                showConfirmButton:false,
                timer:1000,
                ruta:'login'
            })
        })
    } catch (error) {
        console.log(error)
       
    }

}

//Metodo para logearse
exports.login = async(req,res)=>{
    try {
        const user = req.body.user;
        const pass = req.body.password;
        
        if (!user || !pass) {
            res.render('login',{
                alert:true,
                alertTitle:"Advertencia",
                alertMessage:"Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton:true,
                timer:false,
                ruta:'login'
            })
        }else{
            conection.query('SELECT * FROM users WHERE user =?',[user], async(err,results)=>{
                if (results.length == 0 || !(await bcryptjs.compare(pass,results[0].pass))) {
                    res.render('login',{
                        alert:true,
                        alertTitle:"Error",
                        alertMessage:"Usuario y/o contraseña incorrectas",
                        alertIcon:'error',
                        showConfirmButton:true,
                        timer:false,
                        ruta:'login'
                    })
                }else{
                    //Inicio OK
                    const id = results[0].id
                    const token = jwt.sign({id:id},process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })

                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt',token,cookiesOptions)
                    res.render('login',{
                        alert:true,
                        alertTitle:"Conexion exitosa",
                        alertMessage:"Se a conectado exitosamente !",
                        alertIcon:'success',
                        showConfirmButton:false,
                        timer:800,
                        ruta:''

                    })
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.isAuthenticated = async (req,res,next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRETO)
            conection.query('SELECT * FROM users WHERE id =?',[decodificada.id],(err,results)=>{
                if (!results) {
                    return next()
                }
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
            
        }
    }else{
        res.redirect('/login')
    }
}

exports.logout = (req,res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}