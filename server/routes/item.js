const router = require('express').Router()
const ItemController = require('../controllers/item')

router.get('/', ItemController.getAll)
router.get('/:id', ItemController.getDetail)

module.exports = router