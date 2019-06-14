const router = require('express').Router()
const userRoute = require('./user')
const wishlistRoute = require('./wishlist')
const itemsRoute = require('./item')
const newsRoute = require('./news')

router.use('/users',userRoute)
router.use('/items', itemsRoute)
router.use('/wishlist',wishlistRoute)
router.use('/news', newsRoute)

module.exports = router