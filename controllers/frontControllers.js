const express = require('express')
const { consultaExt } = require('../helpers/fetchImdb')
const { consultaInt } = require('../helpers/fecthPropia')
const { validarJwt } = require('../middleware/validarJwt')
const { generarJwt } = require('../helpers/jwt')
const { searchGoogle } = require('../helpers/scrapping')
const bcrypt = require('bcryptjs')



const getIndex = async (req, res,) => {

  res.render('index', {
    titulo: 'Accede a tu usuario',
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




const postSignup = async (req, res) => {

  let userData, respuesta, data, result, token
  let body = { ...req.body }

  try {
    body.isAdmin = false;
    let salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt)

    data = await consultaInt(`/apiusers`, 'post', body)
    result = await data.json()


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
  console.log('remuf')
  const idUser = req.header.id
  const idMovie = req.params.id
  console.log(idUser, idMovie)
  const body = {
    idUser
  }
  console.log(body)
  const remove = await consultaInt(`/apiUsers/films/${idMovie}`, 'delete', body)
  const resp = await remove.json()
  console.log(resp, 'remove')
  res.redirect('/movies')
}
//falta gestión de errores, y no repetir peliculas. Y corregir el redirect
const addMovie = async (req, res) => {

  const idMovie = req.params.id
  const idUser = req.header.id



  try {
    const body = {
      idUser
    }
    const checkMovieOne = await consultaInt(`/apiUsers/films/userFilms/${idMovie}`, 'post', body)
    const result = await checkMovieOne.json()

    if (!result.ok) {

      const movieInfo = await consultaExt(null, idMovie)
      const { title, image, year, runtimeStr, genres, directors } = await movieInfo
      const bodyNew = {
        idUser: idUser,
        title,
        year,
        runtimeStr,
        genres,
        directors,
        image,
        idFilm: idMovie

      }

      const addMovieOne = await consultaInt(`/apiUsers/films/`, 'post', bodyNew)
      const resp = await addMovieOne.json()
      res.redirect('/movies')
    } else {
      res.render('error', {
        error: 'Error al añadir película',
        msg: 'Ya tienes la película añadida'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('error', {
      error: 'Error de conexión',
      msg: 'Error al conectar con  la base de datos'
    })
  }



}



const getSearch = async (req, res) => {

  const busqueda = req.query.query
  const pag = req.query.pag


  if (busqueda) {

    const peticionInt = await consultaInt(`/peliculas/titulo/${busqueda}`)
    const peticionJson = await peticionInt.json()

    if (peticionJson.peliculaEncontrada.length == 0) {
      const peticion = await consultaExt(`${busqueda}`)
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
      console.log(peticionJson.peliculaEncontrada)
      res.render('ourResults', {
        titulo: `Resultados de ${busqueda} de nuestra API`,
        msg: `Se han encontrado ${peticionJson.peliculaEncontrada.length} resultados`,
        query: true,
        data: peticionJson.peliculaEncontrada,
        paginas: 1,
        busqueda
      })
    }


  } else if (!busqueda && pag == 1) {
    res.render('search', {
      titulo: `No has introducido nada en la búsqueda`,
      msg: `Escribe algo`,
      query: false
    })
  } else {
    res.render('search', {
      titulo: `Búsqueda de películas`,
      msg: `Realiza aqui tu búsqueda`,
      query: false
    })
  }


}


const vistaDetalles = async (req, res) => {
  console.log('paso')
  try {


    let id = req.params.id
    let titulo = req.params.title

    const peticion = await consultaExt(null, id)
    console.log(titulo);
    const opiniones = await searchGoogle(titulo)

    // const data=await peticion.json()


    res.render('viewOne', {
      msg: 'estos son los detalles',
      data: peticion,
      opiniones: opiniones

    })
  } catch (error) {

  }
}

const addOurMovies = async (req, res) => {

  const idMovie = req.params.id
  const idUser = req.header.id
  
 
try {
    const body = {
      idUser
    }
    //aqui consulto si ya tiene esa película
    const checkMovieOne = await consultaInt(`/apiUsers/films/userFilms/${idMovie}`, 'post', body)
    const resultOneMovie = await checkMovieOne.json()
    console.log(resultOneMovie, 'corto')

    if (!resultOneMovie.ok) {
      const checkMovie = await consultaInt(`/peliculas/${idMovie}`)
      const result = await checkMovie.json()//informacion de la pelicula en nuestra api
      const { title, image, year, duracion, genero, director } = result.peliculaEncontrada
      const bodyNew = {
        idUser: idUser,
        title,
        year,
        runtimeStr: duracion,
        genres: genero,
        directors:director,
        image,
        idFilm: idMovie

      }
      console.log(bodyNew)

      const addMovieOne = await consultaInt(`/apiUsers/films/`, 'post', bodyNew)//añadimos la pelicula
      const resp = await addMovieOne.json()
      console.log(resp)
      res.redirect('/movies')
    } else {
      res.render('error', {
        error: 'Error al añadir película',
        msg: 'Ya tienes la película añadida'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('error', {
      error: 'Error de conexión',
      msg: 'Error al conectar con  la base de datos'
    })
  }



}

const viewOurMovies =async (req,res) => {
  const  id = req.params.id
  try {
    const checkMovie = await consultaInt(`/peliculas/${id}`)
    const result = await checkMovie.json()
    const { title, image, year, duracion, genero, director, sinopsis, rating } = result.peliculaEncontrada //quitar
    res.render('viewOurMovie', {
      msg: 'Detalles de la película',
      data: result.peliculaEncontrada
      

    })
  } catch (error) {
    res.render('error', {
      error: 'Error de conexión',
      msg: 'Error al capturar los datos de la película'
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
  removeMovie,
  vistaDetalles,
  postSignup,
  addOurMovies,
  viewOurMovies
}