const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const SECRET = process.env.TOKEN_SECRET;

const authToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const verified = jwt.verify(token, SECRET);
        if (!verified) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(verified.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = {
    authToken
};