const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')



const validarJwt = (req, res, next) => {
    
       
    const xToken = req.cookies['xtoken'];
        

        if (!xToken) {
            return res.render('index', {
                titulo: 'No has iniciado sesión',
                msg: 'Inicia sesión para continuar'
            })
        }

        try {

            const payload = jwt.verify(xToken, process.env.JWT_SECRET_KEY);
            
            req.header.id = payload.uid
            req.header.name = payload.name
            

        } catch (error) {
            return res.status(401).json({ //aqui hay que poner un render en vez del return mejor
                ok: false,
                msg: 'Token no válido'
            })
        }

        next()


}

const validarJwtAdmin = (req, res, next) => {
    
       
    const aToken = req.cookies['atoken'];
        console.log(aToken)

        if (!aToken) {
            return res.render('index', {
                titulo: 'No has iniciado sesión',
                msg: 'Inicia sesión para continuar'
            })
        }

        try {

            const payload = jwt.verify(aToken, process.env.JWT_SECRET_KEY2);
            
            req.header.id = payload.uid
            req.header.name = payload.name
            

        } catch (error) {
            return res.status(401).json({ //aqui hay que poner un render en vez del return mejor
                ok: false,
                msg: 'Token no válido'
            })
        }

        next()


}



module.exports = {
    validarJwt,
    validarJwtAdmin
}