const express=require('express');
const router=express.Router();
const bodyParser = require('body-parser');

const {postSignup,getIndex, getSearch, getSignup, addMovie, myMovies, removeMovie, getDashboard,vistaDetalles} = require('../controllers/frontControllers')


const {checkLogin, logout, viewMovie,logins } = require('../controllers/apiUsersControllers')

const {validarJwt} = require('../middleware/validarJwt')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', getIndex);

router.get('/signup', getSignup)
router.post('/signup', postSignup)

router.get('/dashboard',validarJwt,getDashboard)

router.get('/search/?',validarJwt, getSearch)
router.get('/search/add/:id',validarJwt, addMovie) // quitar seguramente
router.get('/search/:id',validarJwt, viewMovie)
/* router.get('/search/:id/:title',vistaDetalles)
 */router.get('/movies',validarJwt, myMovies)
router.get('/dashboard',validarJwt,getDashboard)
router.delete('/remove/:id', validarJwt, removeMovie)


router.get('/logout', logout)

router.get('/login', logins)
router.post('/login', checkLogin)



module.exports = router