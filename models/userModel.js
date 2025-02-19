const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dy88vophl/image/upload/v1732281036/b8gatghaiodpi0bjf9wd.png",
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;