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
        let wishlist  = new Wishlist({
            itemName : req.body.itemName,
            description : req.body.description,
            thumbnail: req.body.thumbnail,
            hover : req.body.hover,
            image : req.body.image,
            price : req.body.price,
            type : req.body.type,
            rarity : req.body.rarity,
            rating : req.body.rating,
            userId : req.body.userId
        })
        wishlist.save()
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static update(req,res,next){
        let setVal = {}
        req.body.itemName && (setVal.itemName = req.body.itemName)
        req.body.description && (setVal.description = req.body.description)
        req.body.thumbnail && (setVal.thumbnail = req.body.thumbnail)
        req.body.hover && (setVal.hover = req.body.hover)
        req.body.image && (setVal.image = req.body,image)
        req.body.price && (setVal.price = req.body.price)
        req.body.type && (setVal.type = req.body.type)
        req.body.rarity && (setVal.rarity = req.body.rarity)
        req.body.rating && (setVal.rating = req.body.rating)

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