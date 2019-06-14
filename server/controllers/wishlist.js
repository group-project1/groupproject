const Wishlist = require('../models/wishlist')

class WishlistController{

    static getAll(req,res,next){
        Wishlist
        .find({})
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        Wishlist
        .findById(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static create(req,res,next){
        console.log('masuk create');
        
        // console.log(req.body);
        // console.log('ini logged user',req.loggedUser);
        
        let wishlist  = new Wishlist({
            itemId : req.body.itemId,
            itemName : req.body.itemName,
            thumbnail: req.body.thumbnail,
            price : req.body.price,
            userId : req.loggedUser.id
        })
        wishlist.save()
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static update(req,res,next){
        let setVal = {}
        req.body.itemId && (setVal.itemId = req.body.itemId)
        req.body.itemName && (setVal.itemName = req.body.itemName)
        req.body.description && (setVal.description = req.body.description)
        req.body.thumbnail && (setVal.thumbnail = req.body.thumbnail)
        req.body.price && (setVal.price = req.body.price)

        Wishlist
        .findById(req.params.id)
        .then(wishlist =>{
            wishlist.set(setVal)
            return wishlist.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        Wishlist
        .findByIdAndDelete(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

}

module.exports = WishlistController