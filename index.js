const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/connection');

const AuthRoutes = require('./routes/authRouter');
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

app.use("/api/auth", AuthRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});