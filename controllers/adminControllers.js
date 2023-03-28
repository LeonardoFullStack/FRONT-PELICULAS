const {consulta}=require('../helpers/fecthPropia')



const mostrarPeliculas = async (req, res) => {



    const respuesta = await consulta("/peliculas", 'get');

    const {data} = await respuesta.json()

    res.render('./admin/indexAdmin',{
        peliculas: data
    });

};



const formActualizar=async(req,res)=>{
    
    try {

        const id=req.params.id

       const url=`/peliculas/${id}`
       
        const respuesta= await consulta(url,'get')

        const unaPelicula= await respuesta.json()

      
        
        res.render('../views/admin/actualizarPelis',{
           pelicula:unaPelicula
        })
         
    } catch (error) {
        console.log(error);
    }

}

const actualizar= async(req,res)=>{

    try {

        const id=req.params.id

        const url=`/peliculas/${id}`

       

        consulta(url,'put',req.body)

    res.redirect('/admin/movies')

    } catch (error) {
        console.log(error);
    }
    
}
const formCrear=(req,res)=>{

    res.render('./admin/crearPelicula')

}
const crear= async(req,res)=>{

    try {

    consulta("/peliculas",'post',req.body)

    res.redirect('/admin/movies')

    } catch (error) {
        console.log(error);
    }
    
}
const eliminando=async(req,res)=>{
    try {
        const id=req.params.id

        const urlDeUnaPelicula=`/peliculas/${id}`

        consulta(urlDeUnaPelicula,'delete',req.body)

        res.redirect('/admin/movies')
        
    } catch (error) {
        
    }
}





module.exports={
    mostrarPeliculas,
    formCrear,
    crear,
    formActualizar,
    actualizar,
    eliminando
}