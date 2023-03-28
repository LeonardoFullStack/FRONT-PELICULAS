const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')



const validarJwt = (req, res, next) => {
    console.log('holi?')
       
        const {xtoken} = req.cookies
        console.log(xtoken)

        if (!xtoken) {
            return res.render('index', {
                titulo: 'No has iniciado sesión',
                msg: 'Inicia sesión para continuar'
            })
        }

        try {

            const payload = jwt.verify(xtoken, process.env.JWT_SECRET_KEY);
            
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
    validarJwt
}