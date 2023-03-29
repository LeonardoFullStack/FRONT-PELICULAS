/* const { createUserConnect, getUserConnect, getAllUsersConnect, deleteUserConnect, updateUserConnect } = require('../models/users') */
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const { generarJwt,generarJwtAdmin } = require('../helpers/jwt')
const { consultaExt } = require('../helpers/fetchImdb')
const { consultaInt } = require('../helpers/fecthPropia')
const express = require('express')
const app = express()

app.use(cookieParser())


const checkLogin = async (req, res) => {

    const { email, password } = req.body

    let userData, passwordOk, token, result
    try {
        userData = await consultaInt(`/apiUsers/${email}`)
        result = await userData.json()


        passwordOk = bcrypt.compareSync(password, result.data[0].password)

        if (passwordOk) {
            if (result.data[0].isadmin) {
                token2 = await generarJwtAdmin(result.data[0].id, result.data[0].name)
                token = await generarJwt(result.data[0].id, result.data[0].name)
                res.cookie('xtoken', token)
                res.cookie('atoken', token2)
                console.log('llego?')
                res.redirect('/admin/movies')
            } else {
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

const viewMovie = async (req, res) => {
    const idMovie = req.params.id
    const peticion = await consulta(null, idMovie)
    console.log(peticion)
    res.render('viewOne', {
        titulo: `${peticion.title}`,
        msg: 'Vista al detalle de la película',
        data: peticion
    })
}



const createUser = async (req, res) => {
    console.log('paso')
    let { name, password, email, image } = req.body
    let salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt)
    console.log(password)

    try {
        const data = await createUserConnect(name, password, email, image)
        const userData = await getUserConnect(email)
        token = await generarJwt(userData[0].id, userData[0].name)

        res.cookie('xtoken', token)

        res.render('dashboard', {
            titulo: 'usuario creado.Bienvenido!',
            msg: 'Mi perfil',
            data: userData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error al crear el usuario'
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
    createUser,
    getUserByEmail,
    deleteUser,
    updateUser,
    checkLogin,
    logout,
    viewMovie
}