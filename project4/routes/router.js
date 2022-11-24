const express = require("express")
const router = express.Router()
const conection = require('../database/db')
const auth = require('../controllers/authController')

//Rutas de las vistas
router.get('/', auth.isAuthenticated,(req,res)=>{
    conection.query('SELECT * FROM users',(err,results)=>{
        if (err) {
            throw err;
        }else{
            res.render('index',{user:req.user,results:results})
        }
    })
    
})

router.get('/login',(req,res)=>{
    res.render('login',{alert:false})
})

router.get('/register',(req,res)=>{
    res.render('register',{alert:false})
})

router.get('/update',(req,res)=>{
    res.render('update')
})

router.get('/test',(req,res)=>{
    res.render('test')
})

router.get('/update/:id',auth.isAuthenticated,(req,res)=>{
    const id = req.params.id;
    conection.query('SELECT * FROM users WHERE id=?',[id],(err,results)=>{
        if (err) {
            throw err
        }else{         
            res.render('update',{user:results[0]})
        }
    })
})

router.post('/updates',(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    conection.query('UPDATE users SET ? WHERE id =?',[{name:name},id],(err,result)=>{
        if (err) {
            throw err
        }else{  
            res.redirect('/')
        }
    })

})

router.get('/delete/:id',(req,res)=>{
    const id = req.params.id;
    conection.query('DELETE FROM users WHERE id =?',[id],(err,results)=>{
        if (err) {
            throw err
        }else{
            res.redirect('/')
        }
    })
})


//Rutas para los metodos del controller
router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/logout', auth.logout)

module.exports = router