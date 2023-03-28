const express=require('express');
const router=express.Router();
const bodyParser = require('body-parser');

const {getIndex, getSearch, getSignup, addMovie, myMovies, removeMovie, getDashboard} = require('../controllers/frontControllers')


const {checkLogin, logout,viewMovie } = require('../controllers/apiUsersControllers')

const {validarJwt} = require('../middleware/validarJwt')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', getIndex);

/* router.get('/dashboard',getDashboard) */
router.get('/signup', getSignup)


router.get('/search/?',validarJwt, getSearch)
router.get('/search/add/:id',validarJwt, addMovie)
router.get('/search/view/:id',validarJwt, viewMovie)
router.get('/movies',validarJwt, myMovies)
router.get('/remove/:id', validarJwt, removeMovie)

router.get('/signup', getSignup)
router.get('/logout', logout)
router.post('/login', checkLogin)



module.exports = router