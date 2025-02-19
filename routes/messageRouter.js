const express = require('express');
const { authToken } = require('../middleware/authMiddleware');
const { getUsersForSidebar, getMessages, sendMessage } = require('../controllers/messageControllers');
const router = express.Router();

router.get("/users", authToken, getUsersForSidebar);
router.get("/:id", authToken, getMessages);

router.post("/send/:id", authToken, sendMessage);

module.exports = router;