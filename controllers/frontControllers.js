const express = require('express')
const { consultaExt } = require('../helpers/fetchImdb')
const { consultaInt } = require('../helpers/fecthPropia')
const { validarJwt } = require('../middleware/validarJwt')
const {generarJwt} = require('../helpers/jwt')
const {searchGoogle} = require('../helpers/scrapping')
const bcrypt = require('bcryptjs')



const getIndex = async (req, res,) => {

  res.render('index', {
    titulo: 'Proyecto intermedio',
    msg: 'Haz login para comenzar'
  })
}

const getDashboard = async (req, res) => {
  res.render('dashboard')
}

const getSignup = async (req, res) => {
  res.render('signup', {
    titulo: 'Crear usuario',
    msg: 'Crea tu usuario en la API de MLE, son ya mas de quinientos billones!'
  })
  }




const postSignup =async (req,res) => {
  console.log('paso1')
  let userData, respuesta,data,result,token
  let body = { ...req.body } 
  console.log(body)
    try {
      body.isAdmin=false;
      let salt = bcrypt.genSaltSync(10);
      body.password = bcrypt.hashSync(body.password, salt)
      console.log('preconsulta')
       data = await consultaInt(`/apiusers`, 'post', body)
       result = await data.json()
       console.log(result)

      if (result.ok) {
        userData = await consultaInt(`/apiUsers/${body.email}`)
        respuesta = await userData.json()
      
        token = await generarJwt(respuesta.data[0].id, respuesta.data[0].name)       
        
        res.cookie('xtoken', token)
        res.redirect('/dashboard')
      }

    } catch (error) {
      res.render('error', {
        error: 'error de conexión',
        msg: 'error al crear usuario'
      })
    }
}

const myMovies = async (req, res) => {
  const id = req.header.id
  
  const myMovies = await consultaInt(`/apiUsers/films/all/${id}`)
  const moviesJson = await myMovies.json()
  
  res.render('myMovies', {
    titulo: `Mis películas`,
    msg: `Consulta aquí tus películas`,
    data: moviesJson.data
  })
}

const removeMovie = async (req, res) => {
  const idUser = req.header.id
  const idMovie = req.params.id
  const remove = await removeMovieConnect(idUser, idMovie)
  res.redirect('/movies')
}
//falta gestión de errores, y no repetir peliculas. Y corregir el redirect
const addMovie = async (req, res) => {

  const idMovie = req.params.id
  const idUsers = req.header.id
  
  const checkMovieOne = await checkMovie(idUsers, idMovie)
  if (checkMovieOne.length == 0) {
    const peticion = await consultaInt(null, idMovie)
    const { title, image, genres, year, runtimeStr, directors } = peticion
    const data = await addMovieConnect(idMovie, idUsers, title, image, genres, year, runtimeStr, directors)

  } else {
    //aqui ya tiene la película
  }

  res.redirect('/movies')
}



const getSearch = async (req, res) => {

  const busqueda = req.query.query
  const pag = req.query.pag //esto hay que ponerlo bien
  if (busqueda) {
    const peticion = await consultaExt(busqueda)
   
    if (peticion) {
      const paginas = Math.ceil(peticion.results.length / 12)
      const primerCorte = (pag - 1) * 12
      const segundoCorte = (pag * 12)

      const miniPeticion = peticion.results.slice(primerCorte, segundoCorte);


      res.render('search', {
        titulo: `Resultados de ${busqueda}`,
        msg: `Se han encontrado ${peticion.results.length} resultados`,
        query: true,
        data: miniPeticion,
        paginas,
        busqueda
      })

    } else {
      res.render('error', {
        error: 'Error',
        msg: 'Error al obtener los resultados'
      })
    }


  } else {
    res.render('search', {
      titulo: `Búsqueda de películas`,
      msg: `Haz aquí tu búsqueda`,
      query: false
    })
  }
}

const vistaDetalles=async (req, res)=>{
  try {

    let id=req.params.id
    let titulo=req.params.title
   
    const peticion = await consultaExt(null,id)
    console.log(titulo);
    const opiniones=await searchGoogle(titulo)
    
    // const data=await peticion.json()


    res.render('viewOne',{
      msg:'estos son los detalles',
      data:peticion,
      opiniones:opiniones
    })
  } catch (error) {
    
  }
}


module.exports = {
  getIndex,
  getDashboard,
  getSignup,
  getSearch,
  addMovie,
  myMovies,
  removeMovie,
  vistaDetalles,
  postSignup
}