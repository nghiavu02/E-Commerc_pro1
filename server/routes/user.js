const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.get('/forgotpassword', ctrls.forgotPassword)
router.post('/resetpassword', ctrls.resetPassword)
router.get('/', verifyAccessToken, isAdmin, ctrls.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], ctrls.delteteUser)
router.put('/update', [verifyAccessToken], ctrls.updateUser)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
module.exports = router