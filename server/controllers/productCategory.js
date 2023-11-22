const productCategory = require('../models/blogCategory')
const asyncHandler = require('express-async-handler')
//thêm mới product category
const createCategory = asyncHandler(async (req, res) => {
    const response = await productCategory.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        data: {
            message: response ? 'thêm mới thành công' : 'thêm mới thất bại',
            result: response ? response : true
        }
    })
})
//lấy ra 1 product category
const getCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    if (!bcid) throw new Error('Missing inputs')
    const response = await productCategory.findById(bcid).select('title')
    return res.status(200).json({
        success: response ? true : false,
        data: {
            message: response ? 'Lấy ra blog category thành công' : '',
            result: response
        }
    })
})
//lấy ra danh sách product category
const getCategorys = asyncHandler(async (req, res) => {
    const response = await productCategory.find().select('title _id')
    return res.status(200).json({
        success: response ? true : false,
        data: {
            message: response ? 'Danh sách blog category' : '',
            result: response
        }
    })
})
//Sửa product category
const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const { title } = req.body
    if (!bcid || !title) throw new Error('Mising inputs')
    const response = await productCategory.findByIdAndUpdate(bcid, { title: title }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        data: {
            message: response ? 'Update blog category thành công' : 'Update blog cateogry thất bại',
            result: response
        }
    })
})
//Xóa product category 
const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await productCategory.findByIdAndDelete(bcid)
    return res.status(200).json({
        success: response ? true : false,
        data: {
            message: response ? 'Xóa product category thành công' : 'Xóa product cateogry thất bại',
            result: response
        }
    })
})

module.exports = {
    createCategory,
    getCategory,
    getCategorys,
    updateCategory,
    deleteCategory,
}