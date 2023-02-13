const d = document;

const $templateUser = d.querySelector(".template-user").content,
      $tableUser = d.querySelector(".table-list-user"),
      $fragment = d.createDocumentFragment();


export const test = () =>{
    console.log("text")
}

export const createTableDB = () =>{
    
    $tableUser.querySelector("tbody").innerHTML = ""

    const dbUsers = JSON.parse(localStorage.getItem('dbuser'))


    for (let index = 0; index < dbUsers.length; index++) {
        const element = dbUsers[index];

        $templateUser.querySelector(".td-id").innerText = index
        $templateUser.querySelector(".td-user").innerText =  element.user
        $templateUser.querySelector(".td-name").innerText = element.name
        $templateUser.querySelector(".a-edit").dataset.id = index
        $templateUser.querySelector(".a-delete").dataset.id = index
    
        let $clone = d.importNode($templateUser,true)
            $fragment.appendChild($clone);
       
    }
    $tableUser.querySelector("tbody").appendChild($fragment)
}

const validaCoincidencia =(elementValidar,campo,db)=>{
    const valida = (element) => element[`${campo}`]== elementValidar
    return db.findIndex(valida)
}

export const validationLogin = (user,pass)=>{

    const userF = user.value.trim().toLowerCase(),
          passF = pass.value.trim()

    const dbuser = JSON.parse(localStorage.getItem('dbuser')),
          validaLogin = validaCoincidencia(userF,"user",dbuser),
          validaPassword = validaCoincidencia(passF,"pass",dbuser)

    if (userF.length ===0 || passF.length ===0) {
        return Swal.fire({
            title:'Error !',
            text:'Usuario y/o password se encuentra vacia !',
            icon:'error',
            showConfirmButton:true,
            timer:false,})
    }


    if (validaLogin == -1 && validaPassword == -1) {
        return Swal.fire({
            title:'Error !',
            text:'Usuario y/o password incorrectas !',
            icon:'error',
            showConfirmButton:true,
            timer:false,})
    }
    
   if (validaLogin >=0 && validaPassword >= 0) {

        
            createTableDB()
            d.querySelector(".title-user-login").innerText = `Bienvenido Administrador : ${dbuser[validaLogin].name}`


       return Swal.fire({
            title:'Conexion exitosa',
            text:'Login correcto !',
            icon:'success',
            showConfirmButton:false,
            timer:1500,}).then(()=>{
                setTimeout(() => {
                    d.querySelector(".container-oy").style.transform = "translateY(-50%)"
                },100);
            })


   }else{

        return Swal.fire({
            title:'Error !',
            text:'Usuario y/o password incorrectas !',
            icon:'error',
            showConfirmButton:true,
            timer:false,})
   }
    




}