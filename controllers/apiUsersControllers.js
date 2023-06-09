/* const { createUserConnect, getUserConnect, getAllUsersConnect, deleteUserConnect, updateUserConnect } = require('../models/users') */
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const { generarJwt, generarJwtAdmin } = require('../helpers/jwt')
const { consultaExt } = require('../helpers/fetchImdb')
const { consultaInt } = require('../helpers/fecthPropia')
const express = require('express')
const app = express()

app.use(cookieParser())
//si el usuario es admin, llevar a /admin 
const logins = async (req, res) => {

    res.render('dashboard')
}

const checkLogin = async (req, res) => {

    const { email, password } = req.body

    let userData, passwordOk, token, result
    try {
        userData = await consultaInt(`/apiUsers/${email}`)
        result = await userData.json()
 

        passwordOk = bcrypt.compareSync(password, result.data[0].password)




    } catch (error) {
        res.render('error', {
            titulo: 'Error al conectar con la base de datos',
            error: `Fallo de conexión`,

        })
    }

    if (passwordOk) {
        if (result.data[0].isadmin) {
            token = await generarJwtAdmin(result.data[0].id, result.data[0].name)
            res.cookie('xtoken', token)

            res.redirect('/admin/movies')
        } else {
            token = await generarJwt(result.data[0].id, result.data[0].name)
            res.cookie('xtoken', token)

            res.redirect('/dashboard')
        }


        res.cookie('xtoken', token)

        res.redirect('/dashboard')



    } else if (!passwordOk) {
        res.render('index', {
            titulo: 'Error al identificar',
            msg: 'Prueba otra vez'
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

const getUserByEmail = async (req, res) => {
    let data, msg
    try {
        let email = req.query.email
        if (email) {
            data = await getUserConnect(email)
            msg = `datos del usuario ${email}`
        } else {
            data = await getAllUsersConnect()
            msg = 'Todos los usuarios'
        }
        res.status(200).json({
            ok: true,
            msg,
            data
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'contacta con el administrador'
        })
    }
}






const deleteUser = async (req, res) => {
    console.log('holi?')
    try {
        const data = await deleteUserConnect(req.params.email)
        res.status(200).json({
            ok: true,
            msg: `El usuario con email ${req.params.email} ha sido borrado`
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error al borrar el usuario'
        })
    }
}

const updateUser = async (req, res) => {
    let { name, password, email, image } = req.body
    const oldMail = req.params.email
    let salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt)
    try {
        const data = await updateUserConnect(oldMail, name, password, email, image)
        res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado',
            data: {
                name,
                password,
                email,
                image
            }
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error al actualizar el usuario'
        })
    }
}

module.exports = {
    getUserByEmail,
    deleteUser,
    updateUser,
    checkLogin,
    logout,
    logins
}