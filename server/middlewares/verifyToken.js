const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


const verifyAccessToken = asyncHandler(async (req, res, next) => {
    //kiểm tra token có bắn đầu bằng Bearer ko, là bearer thì là token để đăng nhập, ko phải thì không phải token để đăng nhập
    // 
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        //lấy ra chỗi token khi đã loại bỏ bearer
        const token = req.headers.authorization.split(' ')[1]
        //check token có hợp lệ không
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            //401: lỗi không có xác thực
            if (err) return res.status(401).json({
                success: false,
                message: 'Invalid access token'
            })
            //decode là cái bỏ vào để tạo token
            //  console.log(decode)
            req.user = decode
            next()
        })
    }
    else {
        res.status(401).json({
            success: false,
            message: 'required authentication'
        })
    }
})
const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user
    if (role != 'Admin') return res.status(401).json({
        success: false,
        message: "Require admin role"
    })
    next()
})

module.exports = {
    verifyAccessToken,
    isAdmin
}