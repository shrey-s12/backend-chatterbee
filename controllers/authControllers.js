const bcrypt = require('bcrypt');
const USER = require('../models/userModel');
const { generateToken } = require('../lib/utils');
const cloudinary = require('../lib/cloudinary');

const Register = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await USER.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new USER({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // generate jwt token 
            generateToken(newUser._id, res);

            // save user to database
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Invalid user Data" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        // generate jwt token
        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const Logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });
        return res.status(200).json({ message: "Logged out" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Please upload a profile picture" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await USER.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error updating profile: ", err);
        res.status(400).json({ message: err.message });
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    Register,
    Login,
    Logout,
    updateProfile,
    checkAuth
}