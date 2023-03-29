const express = require('express')
const router = express.Router();
const{mostrarPeliculas,formActualizar,actualizar,formCrear,eliminando,crear}=require('../controllers/adminControllers')
const {validarJwtAdmin} = require('../middleware/validarJwt')


router.get('/movies',validarJwtAdmin,mostrarPeliculas)


//*CREAR PELICULA

router.get('/createMovie',formCrear)
router.post('/createMovie',crear)

//* ACTUALIZAR PELICULA

router.get('/editMovies/:id',formActualizar)

router.post('/editMovie/:id',actualizar)



//*ELIMINAR

router.get('/removeMovie/:id',eliminando)







module.exports = router;