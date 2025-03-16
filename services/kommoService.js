const axios = require("axios");

async function sendMessageToKommo(userId, username, text) {
    try {
        const chatSearch = await axios.get(`https://tresortech.kommo.com/api/v4/chats`, {
            headers: {
                Authorization: `Bearer ${process.env.KOMMO_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        let existingChat = chatSearch.data._embedded.chats.find(chat => chat.participants.some(p => p.user_id === userId));

        if (!existingChat) {
            const newChat = await axios.post(`https://tresortech.kommo.com/api/v4/chats`, {
                name: `Чат із ${username}`,
                participants: [{ user_id: userId }]
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.KOMMO_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });

            existingChat = newChat.data;
        }

        await axios.post(`https://tresortech.kommo.com/api/v4/messages`, {
            chat_id: existingChat.id,
            sender: {
                id: userId,
                first_name: username
            },
            text: text
        }, {
            headers: {
                Authorization: `Bearer ${process.env.KOMMO_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log(`✅ Повідомлення відправлено в чат Kommo для користувача ${username}`);
    } catch (error) {
        console.error("❌ Помилка при відправці повідомлення в Kommo:", error.response ? error.response.data : error.message);
    }
}

module.exports = { sendMessageToKommo };
