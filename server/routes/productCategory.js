const router = require('express').Router()
const ctrls = require('../controllers/productCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCategorys)
router.get('/:pcid', ctrls.getCategory)
router.put('/:pcid', [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory)
module.exports = router