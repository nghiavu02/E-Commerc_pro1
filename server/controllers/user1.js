const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password) throw new Error('Nhập thiếu thông tin')
    const cheackEmail = User.findOne({ email: email })
    if (cheackEmail) throw new Error('User đã tồn tại')
    else {
        const user = await User.create(req.body)
        return res.status.json({
            success: user ? true : false,
            data: {
                message: user ? 'Đăng ký thành công' : 'Đăng ký thất bại',
                result: user ? user : null
            }
        })
    }
})
module.exports = {

}