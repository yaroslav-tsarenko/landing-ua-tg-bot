require("dotenv").config();
const http = require("http");
const bot = require("./bot");

const PORT = process.env.PORT || 8080;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is running\n');
}).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    bot.launch().then(() => console.log("Бот запущено ✅"));
});

setInterval(async () => {
    console.log("Restarting bot...");
    await bot.stop("Restarting");
    setTimeout(async () => {
        await bot.launch();
        console.log("Бот запущено ✅");
    }, 120000);
}, 600000);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));