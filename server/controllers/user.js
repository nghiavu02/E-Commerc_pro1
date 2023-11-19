const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendToEmail = require('../ultils/sendMail')
const crypto = require('crypto')
//đăng ký tài khoản
const register = asyncHandler(async (req, res, next) => {
    //người dùng gửi lên email, password, firstname, lastname
    const { email, password, firstname, lastname } = req.body
    //check data người dùng gửi lên server
    if (!email || !password || !firstname || !lastname)
        return res.status(404).json({
            success: false,
            message: "Missing inputs",
            result: null
        })
    const user = await User.findOne({ email: email })
    if (user) throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            message: newUser ? 'register is successfully , Please go login..' : 'Something went wrong',
            result: null
        })
    }
})
//refresh token : tạo mới access token
//access token : dùng để xác thực người dùng, phân quyền người dung
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(404).json({
            success: false,
            message: "Missing inputs",
            result: null
        })
    }
    const response = await User.findOne({ email })
    //check email có tồn tại trong db và password có trùng password trong db ko
    if (response && await response.isCorrectPassword(password)) {
        //trả về token
        //sử dụng toán tử rest destructoring để loại bỏ password và role
        //chuyển respone về object thuần
        const { password, role, refreshToken, ...userData } = response.toObject()
        //tạo accesstoken
        const accessToken = generateAccessToken(response._id, role)
        //tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        //lưu refreshtoke vào db
        //new: true trả về data sau khi update, false trả về data trước khi update
        await User.findByIdAndUpdate(response._id, { newRefreshToken }, { new: true })
        //lưu refresh token vào cookie 
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            message: "login thành công",
            accessToken: accessToken,
            result: userData
        })
    } else {
        throw new Error("Xác thực không hợp lệ")
    }
})

const getCurrent = asyncHandler(async (req, res, next) => {
    const { _id } = req.user
    console.log(req.user)
    //select() nếu trường muốn lấy viết vào, nếu không muốn nấy dấu '-'
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        result: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res, next) => {
    //lấy token từ cookie
    const cookie = req.cookies
    //check xem có token hay không
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in  cookies')
    //check xem token có hợp lệ không
    await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
        if (err) throw new Error('Invalid refresh token')
        //check token có khớp với token đã lưu trong db
        const response = await User.findOne({ _id: decode._id, refreshToken: cookie.refreshToken })
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ? generateAccessToken(response._id, response.role) : 'refresh token not matched'
        })
    })
})
const logout = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //xóa refresh token ở cookies
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        message: 'logout is done'
    })
})
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.query;
    if (!email) return next(new Error('Missing email'));

    const user = await User.findOne({ email });
    if (!user) return next(new Error('User not found'));

    const resetToken = user.createPasswordChangedToken();
    await user.save();

    const html = `Xin vui lòng click vào link để thay đổi mật khẩu. Link có hiệu lực trong vòng 15 phút <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;
    const data = {
        email,
        html,
    };

    console.log(email);
    try {
        const rs = await sendToEmail(email, html);
        return res.status(200).json({
            success: true,
            result: rs,
        });
    } catch (error) {
        return next(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error("Mising inputs")
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangeAt = Date.now()
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'mật khẩu đã được thay đổi' : 'lỗi password'
    })
})
const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -role -password')
    return res.status(200).json({
        success: response ? true : false,
        result: response
    })
})
const delteteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error("Mising inputs")
    //response sau khi xóa sẽ trả về user đã bị xóa
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        message: response ? `user with email: ${response.email} deleted` : 'No user'
    })
})
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error("Mising inputs")
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role')
    return res.status(200).json({
        success: response ? true : false,
        message: response ? 'đã update thành công' : 'update thất bại',
        result: response
    })
})
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs")
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role')
    return res.status(200).json({
        success: response ? true : false,
        message: response ? 'đã update thành công bởi admin' : 'update thất bại',
        result: response
    })
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    delteteUser,
    updateUser,
    updateUserByAdmin
}