const express = require("express");
const { handleTelegramWebhook, handleKommoReply } = require("../controllers/telegramController");
const router = express.Router();

router.post("/", handleTelegramWebhook);

router.post("/reply", handleKommoReply);

module.exports = router;
