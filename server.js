require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const telegramRoutes = require("./routes/telegramRoutes");
const app = express();

app.use(bodyParser.json());

app.use("/webhook", telegramRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server запущено на порту ${PORT} 🚀`));
