
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const { generarJwt,generarJwtAdmin } = require('../helpers/jwt')
const { consultaExt } = require('../helpers/fetchImdb')
const { consultaInt } = require('../helpers/fecthPropia')
const express = require('express')
const app = express()

app.use(cookieParser())
//si el usuario es admin, llevar a /admin 
const logins =async (req,res) =>{
    
    res.render('dashboard')
}

const checkLogin = async (req, res) => {
   


    const { email, password } = req.body
    console.log(req.body)
    let userData, passwordOk, token, result
    try {
        userData = await consultaInt(`/apiUsers/${email}`,)
        result = await userData.json()
        console.log(result)


        passwordOk = bcrypt.compareSync(password, result.data[0].password)

        if (passwordOk) {
            console.log('passwordok')
            if (result.data[0].isadmin) {
                token2 = await generarJwtAdmin(result.data[0].id, result.data[0].name)
                token = await generarJwt(result.data[0].id, result.data[0].name)
                res.cookie('xtoken', token)
                res.cookie('atoken', token2)
               
                res.redirect('/admin/movies')
            } else {
                console.log(result.data[0].id, result.data[0].name);
                token = await generarJwt(result.data[0].id, result.data[0].name)
                res.cookie('xtoken', token)

                res.redirect('/dashboard')
            }
        } else if (!passwordOk) {
            res.render('index', {
                titulo: 'Error al identificar',
                msg: 'Prueba otra vez'
            })
        }


    } catch (error) {
        res.render('error', {
            titulo: 'Error al conectar con la base de datos',
            error: `Fallo de conexión`,

        })
    }
}

const logout = (req, res) => {

    if (req.cookies.xtoken) {
        res.clearCookie('xtoken')



        res.render('index', {
            titulo: 'Sesión cerrada',
            msg: 'Haz login para comenzar'

        })
    } else {
        res.render('index', {
            titulo: 'Proyecto intermedio',
            msg: 'Haz login para comenzar'
        })
    }



}



const viewMovie = async (req, res) => { // gestión de errores
    console.log('viumubi')
    const idMovie = req.params.id
    const peticion = await consultaExt(null, idMovie)
    console.log(peticion)
    res.render('viewOne', {
        titulo: `${peticion.title}`,
        msg: 'Vista al detalle de la película',
        data: peticion
    })
}







module.exports = {
    checkLogin,
    logout,
    viewMovie,
    logins
}