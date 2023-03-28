const {validationResult}=require('express-validator')  



const validarInputs=(req,res,next)=>{
    console.log('holi?')
    const errors=validationResult(req)
    
    if(errors.isEmpty()){
      next()
    }else{ return res.status(404).json({
            ok:false,
            msg:'Error al obtener los Peliculas',
            errores:errors.mapped()
    })
}
      
}


module.exports={
    validarInputs
}