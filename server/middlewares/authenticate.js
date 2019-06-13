const { verify } = require('../helpers/jwt')
const  User = require('../models/user')
module.exports = function(req,res,next){
    if(req.headers.hasOwnProperty('token')){
        let decoded = verify(req.headers.token,`${process.env.SECRET_KEY}`)
        User.findOne({
            where : {email : decoded.email}
        })
        .then(user =>{
            if(user){
                req.loggedUser = decoded
                next()
            }else {
                next({msg : `token is not recognized`})
            }
        })
        .catch(next)
        // console.log('ini decoded',decoded);
        // req.loggedUser = decoded
        // console.log(req.loggedUser)
    }
    else{
        next({msg : `you need to login first`, code: 401})
    }
}