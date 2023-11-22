const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const product = require('../models/product')
const util = require('util')
const { query } = require('express')
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
//filtering, sorting, paginaytion
const getProducts = asyncHandler(async (req, res, next) => {
    const queries = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(item => delete queries[item])
    //advanced filtering 
    let queryString = JSON.stringify(queries)
    //tìm chỗi gte thay thế bằng => $get
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    const formatedQueries = JSON.parse(queryString)

    //filtering
    //regex: , 'i': không phân biệt hoa thường
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    let queryCommand = Product.find(formatedQueries)
    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    else {
        queryCommand = queryCommand.sort('-createAt')
    }
    //Field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //Pagination
    const page = +req.query.page * 1 || 1;
    const limit = +req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);
    //  Execute query
    queryCommand.then(async (response) => {
        const counts = await Product.find(formatedQueries).countDocuments()
        res.status(200).json({
            success: response ? true : false,
            data: {
                message: response ? "Lấy ra sản phẩm" : "lấy sản phẩm thất bại",
                counts,
                products: response ? response : null,
            }
        })
    }).catch(next)
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
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!_id || !pid) throw new Error('Nhập thiếu thông tin');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(
        (el) => el.postedBy.toString() === _id.toString()
    );
    if (alreadyRating) {
        await Product.updateOne(
            {
                ratings: { $elemMatch: { postedBy: _id } },
            },
            {
                $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
            }
        );
    } else {
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } },
        });
    }
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updateProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, e) => sum + +el.star, 0)
    updatedProduct.totalRating = Math.round(sumRatings * 10 / ratingCount) / 10
    await updatedProduct.save()
    return res.status(200).json({
        status: true,
    });
});
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
}