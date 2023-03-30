

const consultaExt = async (titulo, id) => {

  let ruta;
  
  if  (id) {
      ruta=`https://imdb-api.com/en/API/Title/k_vi4x48ks/${id}`,
      console.log(ruta)
    } else if (titulo && id == null) {
      ruta=`https://imdb-api.com/API/AdvancedSearch/k_vi4x48ks/?title=${titulo}`
      console.log(ruta)
    }
    try {


      let peticion = await fetch(ruta,
        {
          method: "GET",
        });

      if (peticion.ok) {
        const respuesta = await peticion.json();
        return respuesta;

      } else throw "Error en la ejecución";

    } catch (error) {

      return error;
    }
  };


  module.exports={
    consultaExt
}