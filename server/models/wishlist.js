const mongoose = require("mongoose")
const Schema = mongoose.Schema


let wishlistSchema = new Schema({
    itemName : String,
    description : String,
    thumbnail: String,
    hover : String,
    image : String,
    price : String,
    type : String,
    rarity : String,
    rating : Object,
    userId : String
})

let Wishlist = mongoose.model('wishlist',wishlistSchema)

module.exports = Wishlist