const mongoose = require('mongoose'); // Erase if already required

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    catogory: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    quatity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        enum: ['black', 'yellow', 'red', 'pink', 'white'],
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String }
        }
    ],
    totalRating: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', productSchema)