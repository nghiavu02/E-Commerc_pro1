const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numberView: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Types.ObjectId, ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId, ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fphoto_133391293_creative-blogging-sketch-on-white-brick-wall-background-blog-and-media-concept-3d-rendering.html&psig=AOvVaw3qBOkcRh4rYXo3w-eNYWn5&ust=1700764113170000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCIic55ie2IIDFQAAAAAdAAAAABAE'
    },
    author: {
        type: String,
        default: 'Admin'
    }

}, {
    timestamps: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);