const jwt = require('jsonwebtoken')
const Wishlist = require('../models/wishlist')

module.exports = function(req,res,next){
    // let todoId = req.params.id 
    // let userId = req.loggedUser.id
    let option = {
        id : req.params.id,
        UserId : req.loggedUser.id
    }

    Wishlist.findOne(option)
    .then(wishlist =>{
        console.log('masuk authorize ok',wishlist);
        if(wishlist){
            next()
        }else {
            next({code : 401, msg : `you're not authorized`})
        }
    })
    .catch(next)
    
}