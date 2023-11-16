const User = require('../models/user')
const asyncHandler = require('express-async-handler')
//đăng ký tài khoản
const register = asyncHandler(async (req, res, next) => {
    //người dùng gửi lên email, password, firstname, lastname
    const { email, password, firstname, lastname } = req.body
    //check data người dùng gửi lên server
    if (!email || !password || !firstname || !lastname)
        return res.status(404).json({
            sucess: false,
            mes: "Missing inputs"
        })
    const response = await User.create(req.body)
    return res.status(200).json({
        //
        sucess: response ? true : false,
        response
    })
})

module.exports = {
    register
}