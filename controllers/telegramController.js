const bot = require("../telegramBot");
const axios = require("axios");
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
        const { contact_id, message } = req.body;
        if (!contact_id || !message) return res.status(400).send("Invalid data");

        const contactData = await axios.get(`https://tresortech.kommo.com/api/v4/contacts/${contact_id}`, {
            headers: {
                Authorization: `Bearer ${process.env.KOMMO_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const telegram_id = contactData.data.custom_fields_values.find(f => f.field_name === "Telegram ID")?.values[0]?.value;
        if (!telegram_id) return res.status(404).send("Telegram ID not found");

        await bot.telegram.sendMessage(telegram_id, message);
        res.send("Message sent to Telegram");
    } catch (error) {
        console.error("Помилка при відправці відповіді в Telegram:", error);
        res.status(500).send("Error");
    }
}


module.exports = { handleTelegramWebhook, handleKommoReply };
