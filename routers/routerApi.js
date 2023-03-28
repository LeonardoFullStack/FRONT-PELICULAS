const express = require('express');
const router = express.Router();
const{check}=require('express-validator');
const{validarInputs}=require('../middleware/validarInputs')


const { getPeliculas,crearPelicula,actualizarPelicula,eliminarPelicula,getPelicula } = require('../controllers/apiControllers')



router.get('/', getPeliculas)      //* GET

router.get('/:id',getPelicula)

router.post('/',[
    check('title','Falta el titulo de la pelicula').not().isEmpty(),
    check('image','Falta la imagen').not().isEmpty(),
    check('director','Falta el director').not().isEmpty(),
    check('year','Falta el año').not().isEmpty(),
    validarInputs],
    crearPelicula)                                //*POST

router.put('/:id',[
    check('title','Falta el titulo de la pelicula').not().isEmpty(),
    check('image','Falta la imagen').not().isEmpty(),
    check('director','Falta el director').not().isEmpty(),
    check('year','Falta el año').not().isEmpty(),
    validarInputs], 
    actualizarPelicula)//* PUT
    
 router.delete('/:id', eliminarPelicula) //* DELETE




module.exports = router;