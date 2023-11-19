const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const product = require('../models/product')
const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length == 0) throw new Error('Mising inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        succes: newProduct ? true : false,
        data: {
            message: newProduct ? "Tạo sản phẩm thành công" : "Tạo sản phẩm không thành công",
            product: newProduct
        }
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        data: {
            message: product ? "Lấy ra 1 sản phẩm" : "lấy sản phẩm thất bại",
            product: product ? product : null
        }
    })
})
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
    return res.status(200).json({
        success: products ? true : false,
        data: {
            message: products ? "Lấy ra sản phẩm" : "lấy sản phẩm thất bại",
            products: products ? products : null
        }
    })
})
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    //check xem có thay đổi title không
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updateProduct ? true : false,
        data: {
            message: updateProduct ? 'Cập nhập sản phẩm thành công' : 'cập nhập sản phẩm thất bại',
            product: updateProduct ? updateProduct : ''
        }
    })
})
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProduct ? true : false,
        data: {
            message: deleteProduct ? 'Xóa sản phẩm thành công' : 'xóa sản phẩm thất bại',
            product: deleteProduct ? deleteProduct : ''
        }
    })
})
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
}