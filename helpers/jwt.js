const jwt = require('jsonwebtoken');


const generarJwt = (uid, name) => {

    return new Promise((resolve, reject)=>{
        let payload = {uid,name};
        jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:'3h'},(error,token)=>{
            if (error) {
                reject('error al generar el token')
            }
            resolve(token)
        })
    })

}

module.exports = {
    generarJwt
}