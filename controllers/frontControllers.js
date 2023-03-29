const express = require('express')
const { consultaExt } = require('../helpers/fetchImdb')
const {consultaInt} = require('../helpers/fecthPropia')
const { validarJwt } = require('../middleware/validarJwt')

const getIndex = async (req, res,) => {

  res.render('index', {
    titulo: 'Proyecto intermedio',
    msg: 'Haz login para comenzar'
  })
}

const getDashboard = async (req,res) =>{
  res.render('dashboard')
}

const getSignup = (req,res) => {

  res.render('signup', {
    titulo: 'Crear usuario',
    msg: 'Crea tu usuario en la API de MLE, son ya mas de quinientos billones!'
  })

}

const myMovies =async (req,res) => {
  const id = req.header.id
  console.log(id)
  const myMovies = await consultaInt(`/apiUsers/films/all/${id}`)
  const moviesJson = await myMovies.json()
  console.log(moviesJson)
  res.render('myMovies', {
    titulo: `Mis películas`,
    msg: `Consulta aquí tus películas`,
    data:moviesJson.data
  })
}

const removeMovie  =async (req,res) => {
  const idUser = req.header.id
  const idMovie = req.params.id
  const remove = await removeMovieConnect(idUser, idMovie)
  res.redirect('/movies')
}
//falta gestión de errores, y no repetir peliculas. Y corregir el redirect
const addMovie =async  (req,res) => {

  const idMovie=req.params.id
  const idUsers = req.header.id
  console.log(idMovie,idUsers)
  const checkMovieOne = await checkMovie(idUsers, idMovie)
  if (checkMovieOne.length == 0) {
    const peticion = await consultaInt(null, idMovie)
    const {title, image, genres, year, runtimeStr, directors} = peticion
    const data = await addMovieConnect(idMovie, idUsers,title, image, genres, year, runtimeStr, directors)
  
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
    console.log(peticion)
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

module.exports = {
  getIndex,
  getDashboard,
  getSignup,
  getSearch,
  addMovie,
  myMovies,
  removeMovie
}