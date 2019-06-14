const router = require('express').Router()
const NewsController = require('../controllers/news')

router.get('/', NewsController.getAll)

module.exports = router