const router = require('express').Router()
const WishlistController = require('../controllers/wishlist')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.use(authenticate)

router.get('/',WishlistController.getAll)
router.get('/:id',WishlistController.getOne)
router.post('/',WishlistController.create)
router.patch('/:id',WishlistController.update)
router.delete('/:id',WishlistController.delete)

module.exports = router