const bot = require("../telegramBot");

async function handleTelegramWebhook(req, res) {
    try {
        await bot.handleUpdate(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error("Помилка вебхуку Telegram:", error);
        res.sendStatus(500);
    }
}

async function handleKommoReply(req, res) {
    try {
        const { telegram_id, message } = req.body;
        if (!telegram_id || !message) return res.status(400).send("Invalid data");

        await bot.telegram.sendMessage(telegram_id, message);
        res.send("Message sent to Telegram");
    } catch (error) {
        console.error("Помилка при відправці відповіді в Telegram:", error);
        res.status(500).send("Error");
    }
}

module.exports = { handleTelegramWebhook, handleKommoReply };
