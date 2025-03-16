require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const sendMessageToKommo = require("./services/kommoService");
const bot = new Telegraf(process.env.BOT_TOKEN);

const mainMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🟡 Новий сайт для ЖК / котеджного містечка", "new_site"), Markup.button.callback("🟡 Редизайн або доопрацювання сайту", "redesign")],
    [Markup.button.callback("🟡 Налаштування реклами (Google / Meta)", "ads"), Markup.button.callback("🟡 Підключення шахматки / CRM", "crm")],
    [Markup.button.callback("🟡 Безкоштовний аудит сайту / реклами", "audit"), Markup.button.callback("ℹ️ Послуги та FAQ", "faq")],
    [Markup.button.url("ℹ️ Зв'язатись з менеджером", "https://t.me/landing_ua_manager_chat_bot")],
]);

const faqMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🏗 Наші послуги", "our_services")],
    [Markup.button.callback("💰 Ціни на пакети", "pricing")],
    [Markup.button.callback("❓ Часті запитання (FAQ)", "frequent_questions")],
    [Markup.button.callback("🔍 Замовити безкоштовний аудит", "order_audit")],
    [Markup.button.callback("⬅️ Назад до головного меню", "main_menu")]
]);

const auditMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🔍 Замовити безкоштовний аудит", "order_audit")],
    [Markup.button.callback("⬅️ Назад до головного меню", "main_menu")]
]);

bot.on("text", async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username || "Анонім";
    const text = ctx.message.text;

    await sendMessageToKommo(userId, username, text);
    await ctx.reply("✅ Ваше повідомлення передано менеджеру!");
});

bot.action("order_audit", async (ctx) => {
    try {
        await ctx.telegram.sendMessage(ctx.chat.id, "Замовлення на безкоштовний аудит");
    } catch (error) {
        console.error("Помилка при відправці повідомлення:", error);
    }
});

bot.start(async (ctx) => {
    try {
        const message = await ctx.reply(
            `Привіт, ${ctx.from.first_name}! 👋\nДякуємо за звернення до Landing.ua. Ми допомагаємо забудовникам отримувати більше клієнтів через ефективні сайти та маркетинг.\n\nОберіть послугу:`,
            mainMenu
        );
        ctx.session = { mainMessageId: message.message_id };
    } catch (error) {
        console.error("Помилка відправки стартового повідомлення:", error);
    }
});

function createSubMenu(text, backAction) {
    return Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Назад до головного меню", backAction)]
    ]);
}

async function editMenu(ctx, text, keyboard) {
    try {
        await ctx.editMessageText(text, keyboard);
    } catch (error) {
        console.error("Помилка редагування меню:", error);
    }
}

bot.action("new_site", async (ctx) => {
    await editMenu(ctx, "🔹 Ми розробляємо сайти під ключ для ЖК.\n\n⬇️ Оберіть дію:", createSubMenu("🔙 Головне меню", "main_menu"));
});

bot.action("redesign", async (ctx) => {
    await editMenu(ctx, "🔹 Пропонуємо редизайн або покращення функціоналу вашого сайту.\n\n⬇️ Оберіть дію:", createSubMenu("🔙 Головне меню", "main_menu"));
});

bot.action("ads", async (ctx) => {
    await editMenu(ctx, "🔹 Налаштовуємо рекламні кампанії для вашого бізнесу.\n\n⬇️ Оберіть дію:", createSubMenu("🔙 Головне меню", "main_menu"));
});

bot.action("crm", async (ctx) => {
    await editMenu(ctx, "🔹 Інтегруємо CRM-системи для автоматизації продажів.\n\n⬇️ Оберіть дію:", createSubMenu("🔙 Головне меню", "main_menu"));
});

bot.action("audit", async (ctx) => {
    await editMenu(ctx, "🔹 Готові безкоштовно перевірити ваш сайт або рекламу.\n\n⬇️ Оберіть дію:", auditMenu);
});

bot.action("faq", async (ctx) => {
    await editMenu(ctx, "🔹 Основні послуги та відповіді на популярні запитання.\n\n⬇️ Оберіть дію:", faqMenu);
});

bot.action("main_menu", async (ctx) => {
    await editMenu(ctx, `Привіт, ${ctx.from.first_name}! 👋\nДякуємо за звернення до Landing.ua. Оберіть послугу:`, mainMenu);
});

bot.launch().then(() => console.log("Бот запущено ✅"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

