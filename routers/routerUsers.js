const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const { validarInputs } = require('../middleware/validarInputs')


const { createUser, getUserByEmail, deleteUser, updateUser, viewMovie } = require('../controllers/apiUsersControllers')

router.get('/', getUserByEmail)
router.post('/',/* [
    check('name','Tienes que poner un nombre').not().isEmpty(),
    check('email', 'el email no es válido').not().isEmpty().isEmail(),
    check('pass', 'La contraseña tiene que tener mínimo 4 caracteres').isLength({min:4}),
    validarInputs
], */ createUser)

router.delete('/:email',/*  [
    check('email', 'el email no es válido').not().isEmpty().isEmail(),
    validarInputs
], */ deleteUser)
router.put('/:email',/* [
    check('name','Tienes que poner un nombre').not().isEmpty(),
    check('email', 'el email no es válido').not().isEmpty().isEmail(),
    check('pass', 'La contraseña tiene que tener mínimo 4 caracteres').isLength({min:4}),
    validarInputs
], */ updateUser)



module.exports = router