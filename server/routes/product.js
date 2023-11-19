const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/create', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.get('/', ctrls.getProducts)
router.get('/:pid', ctrls.getProduct)
module.exports = router