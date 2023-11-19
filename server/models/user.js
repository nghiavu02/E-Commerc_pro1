const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')
// Declare the Schema of the Mongo model

var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Array,
        default: []
    },
    address: [
        //là 1 mảng chứa những id của bảng adrres
        { type: mongoose.Types.ObjectId, ref: 'Address' }
    ],
    wishlist: [
        //là 1 mảng chứa những id của bảng adrres
        { type: mongoose.Types.ObjectId, ref: 'Product' }
    ],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    passwordChangeAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String
    }

}, {
    //check thời gian theo kiểu timetimestamps
    timestamps: true
})
//Hash password chỉ chạy lưu không chạy update dữ liệu
//ko sử dụng đc arrow function do ko sử dụng đc this
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next()
    }
    //bỏ lượng muối dể hash password
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}
//Export the model
module.exports = mongoose.model('User', userSchema)
