const express=require('express');
const router=express.Router();
const bodyParser = require('body-parser');

const {postSignup,getIndex, getSearch, getSignup, addMovie, myMovies, removeMovie, getDashboard,vistaDetalles,addOurMovies, viewOurMovies} = require('../controllers/frontControllers')


const {checkLogin, logout, viewMovie,logins } = require('../controllers/UsersControllers')

const {validarJwt} = require('../middleware/validarJwt')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', getIndex);

router.get('/signup', getSignup)
router.post('/signup', postSignup)

router.get('/dashboard',validarJwt,getDashboard)

router.get('/search/?',validarJwt, getSearch) // Buscar, primero en nuestra  api

router.get('/search/add/:id',validarJwt, addMovie) // añadir peliculas de imdb
router.get('/search/addApi/:id',validarJwt, addOurMovies) //añadir películas de nuestra api

router.get('/search/:id/:title',validarJwt, vistaDetalles) //vista detalle peli de imdb
router.get('/search/viewOne/ourApi/:id',validarJwt, viewOurMovies)// vista detalle nuestra api


router.get('/movies',validarJwt, myMovies)
router.get('/dashboard',validarJwt,getDashboard)
router.get('/remove/:id', validarJwt, removeMovie)


router.get('/logout', logout)

router.get('/login', logins)
router.post('/login', checkLogin)



module.exports = router