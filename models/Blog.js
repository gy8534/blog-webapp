const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    body:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('BLog', BlogSchema);

module.exports = User;