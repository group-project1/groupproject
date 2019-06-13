const router = require('express').Router()
const userRoute = require('./user')
const wishlistRoute = require('./wishlist')

router.use('/users',userRoute)
router.use('/wishlist',wishlistRoute)

module.exports = router