const mysql =require('mysql2')

const conection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
})


conection.connect((err)=>{
    if (err) {
        console.log(`Error en la conexion :`+err)
        return
    }

    console.log("CONEXION EXITOSA !")
})

module.exports = conection
