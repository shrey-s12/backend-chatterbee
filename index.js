const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/connection');

const AuthRoutes = require('./routes/authRouter');
const MessageRoutes = require('./routes/messageRouter');
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use("/api/auth", AuthRoutes);
app.use("/api/message", MessageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});