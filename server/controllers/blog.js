const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');

const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error('Missing inputs');
    const response = await Blog.create(req.body);
    return res.json({
        success: response ? true : false,
        createBlog: response ? response : 'Cannot create new blog',
    });
});

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.json({
        success: response ? true : false,
        blogs: response ? response : 'Cannot get blogs',
    });
});

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    const response = await Blog.findByIdAndUpdate(bid, req.body, {
        new: true,
    });
    return res.json({
        success: response ? true : false,
        updateBlog: response ? response : 'Cannot update blog',
    });
});

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing inputs');
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { dislikes: _id },
                $push: { likes: _id },
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response,
        });
    }
    const isLiked = blog?.likes?.find((el) => el.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { likes: _id },
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $push: { likes: _id },
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response,
        });
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing inputs');
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.likes?.find((el) => el.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { likes: _id },
                $push: { dislikes: _id },
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response,
        });
    }
    const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { dislikes: _id },
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $push: { dislikes: _id },
            },
            { new: true }
        );
        return res.json({
            success: response ? true : false,
            response,
        });
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(
        bid,
        { $inc: { numberViews: 1 } },
        { new: true }
    )
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname');
    return res.json({
        success: response ? true : false,
        response,
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        deleteBlog: response ? response : 'Cannot delete blog',
    });
});

module.exports = {
    createBlog,
    updateBlog,
    getBlogs,
    getBlog,
    likeBlog,
    dislikeBlog,
    deleteBlog,
};
