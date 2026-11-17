const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getNotifications, deleteNotification } = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications);

router.delete("/:notificationId", authMiddleware, deleteNotification);

module.exports = router;
