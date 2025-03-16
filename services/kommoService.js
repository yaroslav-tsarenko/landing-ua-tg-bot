require("dotenv").config();
const axios = require("axios");

async function sendMessageToKommo(userId, username, text) {
    try {
        await axios.post(`https://tresortech.kommo.com/api/v4/leads`, [
            {
                name: `Повідомлення від ${username}`,
                contacts: [
                    {
                        first_name: username,
                        custom_fields_values: [
                            { field_name: "Telegram ID", values: [{ value: userId }] },
                            { field_name: "Повідомлення", values: [{ value: text }] }
                        ]
                    }
                ]
            }
        ], {
            headers: {
                Authorization: `Bearer ${process.env.KOMMO_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Помилка при відправці в Kommo:", error);
    }
}

module.exports = { sendMessageToKommo };
