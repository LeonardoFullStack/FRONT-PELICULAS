const express=require('express');
const router=express.Router();
const bodyParser = require('body-parser');

const {getIndex, getSearch, getSignup, addMovie, myMovies, removeMovie, getDashboard} = require('../controllers/frontControllers')


const {checkLogin, logout, viewMovie,logins } = require('../controllers/apiUsersControllers')

const {validarJwt} = require('../middleware/validarJwt')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', getIndex);


router.post('/signup', getSignup)
router.get('/dashboard',validarJwt,getDashboard)

router.get('/search/?',validarJwt, getSearch)
router.get('/search/add/:id',validarJwt, addMovie)
router.get('/search/view/:id',validarJwt, viewMovie)
router.get('/movies',validarJwt, myMovies)
router.delete('/remove/:id', validarJwt, removeMovie)

router.get('/signup', getSignup)
router.get('/logout', logout)

router.get('/login', logins)
router.post('/login', checkLogin)



module.exports = router