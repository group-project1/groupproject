const mongoose = require('mongoose')
const Schema = mongoose.Schema


let wishlistSchema = new Schema({
    itemId : String,
    itemName : String,
    thumbnail : String,
    price : String,
    userId : String
})

let Wishlist = mongoose.model('wishlist',wishlistSchema)

module.exports = Wishlist