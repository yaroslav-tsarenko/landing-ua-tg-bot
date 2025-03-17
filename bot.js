require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

const faqAnswers = {
    "faq_1": "Ми створюємо сайти для забудовників: лендинги, багатосторінкові сайти ЖК, корпоративні сайти, сайти з інтерактивними картами.",
    "faq_2": "Так, ми допоможемо з написанням SEO-текстів, підбором та обробкою візуальних матеріалів, інтеграцією контенту.",
    "faq_3": "Так, ми створюємо шахматки на основі 3D-візуалізації та підключаємо їх до CRM.",
    "faq_4": "Так, ми інтегруємо CRM для забудовників, що дозволяє керувати продажами, заявками та статусами об'єктів.",
    "faq_5": "Так, ми створюємо буклети, банери, рекламні макети, презентації для соціальних мереж та друку.",
    "faq_6": "Лендинг займає 2-3 тижні, повноцінний сайт ЖК – 4-6 тижнів, складні проекти – до 8 тижнів.",
    "faq_7": "Ми надаємо технічну підтримку, оновлення контенту, а також довгострокову співпрацю з фіксованою оплатою.",
    "faq_8": "Так, ви можете підписатися на підтримку, розробку або маркетинг з щомісячною оплатою.",
    "faq_9": "Ми гарантуємо стабільність роботи сайту, усунення технічних проблем у гарантійний період та консультації після завершення проекту."
};

const servicesDetails = {
    "service_sites": "Ми створюємо веб-сайти: лендинги, багатосторінкові сайти ЖК, корпоративні сайти, сайти з інтерактивними картами.",
    "service_ads": "Ми налаштовуємо рекламу в Google, Facebook/Meta для збільшення трафіку та заявок.",
    "service_crm": "Ми інтегруємо CRM-системи для забудовників, автоматизуємо процеси продажів.",
    "service_marketing": "Ми створюємо буклети, банери, презентації та рекламні макети для соціальних мереж."
};

const servicePrices = {
    "service_sites": "💰 Ціни на створення сайтів:\n\n" +
        "🔹 Лендинг – 500$\n" +
        "🔹 Багатосторінковий сайт – 1200$\n" +
        "🔹 Корпоративний сайт – 1800$\n" +
        "🔹 Сайт з інтерактивними функціями – 2500$",

    "service_ads": "💰 Ціни на налаштування реклами:\n\n" +
        "🔹 Google Ads – від 300$\n" +
        "🔹 Facebook / Meta Ads – від 350$\n" +
        "🔹 Комплексне налаштування – від 700$",

    "service_crm": "💰 Ціни на інтеграцію CRM:\n\n" +
        "🔹 Підключення CRM – 500$\n" +
        "🔹 Автоматизація процесів – 1000$\n" +
        "🔹 Розширена CRM + Автоматизація – 1500$",

    "service_marketing": "💰 Ціни на маркетингові матеріали:\n\n" +
        "🔹 Буклети (дизайн + друк) – 200$\n" +
        "🔹 Банери – 150$\n" +
        "🔹 Презентація (до 10 слайдів) – 300$\н" +
        "🔹 Рекламні макети – від 250$"
};

const pricingMenu = Markup.inlineKeyboard([
    [Markup.button.callback("💰 Сайти", "pricing_sites")],
    [Markup.button.callback("💰 Реклама", "pricing_ads")],
    [Markup.button.callback("💰 CRM", "pricing_crm")],
    [Markup.button.callback("💰 Маркетингові матеріали", "pricing_marketing")],
    [Markup.button.callback("⬅️ Повернутись назад", "faq")]
]);

bot.action("pricing", async (ctx) => {
    try {
        if (ctx.callbackQuery.message) {
            await ctx.editMessageText("💰 Оберіть послугу, щоб дізнатися ціну:", pricingMenu);
        } else {
            await ctx.reply("💰 Оберіть послугу, щоб дізнатися ціну:", pricingMenu);
        }
    } catch (error) {
        console.error("❌ Error updating message:", error);
    }
});

Object.keys(servicePrices).forEach((serviceKey) => {
    bot.action(`pricing_${serviceKey.split("_")[1]}`, async (ctx) => {
        try {
            if (ctx.callbackQuery.message) {
                await ctx.editMessageText(
                    servicePrices[serviceKey],
                    Markup.inlineKeyboard([
                        [Markup.button.callback("⬅️ Назад до цін", "pricing")]
                    ])
                );
            } else {
                await ctx.reply(
                    servicePrices[serviceKey],
                    Markup.inlineKeyboard([
                        [Markup.button.callback("⬅️ Назад до цін", "pricing")]
                    ])
                );
            }
        } catch (error) {
            console.error("❌ Error updating message:", error);
        }
    });
});

const servicesMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📌 Створення сайтів", "service_sites")],
    [Markup.button.callback("📌 Налаштування реклами", "service_ads")],
    [Markup.button.callback("📌 CRM та автоматизація", "service_crm")],
    [Markup.button.callback("📌 Маркетингові матеріали", "service_marketing")],
    [Markup.button.callback("⬅️ Повернутись назад", "faq")]
]);

const faqQuestionsMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📌 Які типи сайтів ви створюєте?", "faq_1")],
    [Markup.button.callback("📌 Чи допоможете з наповненням сайту?", "faq_2")],
    [Markup.button.callback("📌 Чи можете допомогти зі створенням шахматки?", "faq_3")],
    [Markup.button.callback("📌 Чи надаєте послуги інтеграції CRM?", "faq_4")],
    [Markup.button.callback("📌 Чи створюєте маркетингові матеріали?", "faq_5")],
    [Markup.button.callback("📌 Як довго триває створення сайту?", "faq_6")],
    [Markup.button.callback("📌 Чи забезпечуєте підтримку після запуску?", "faq_7")],
    [Markup.button.callback("📌 Чи пропонуєте довгострокову співпрацю?", "faq_8")],
    [Markup.button.callback("📌 Які гарантії ви надаєте?", "faq_9")],
    [Markup.button.callback("⬅️ Повернутись назад", "faq")]
]);

bot.action("frequent_questions", async (ctx) => {
    await ctx.editMessageText("❓ Часті запитання (FAQ):", faqQuestionsMenu);
});

Object.keys(faqAnswers).forEach((faqKey) => {
    bot.action(faqKey, async (ctx) => {
        await ctx.editMessageText(
            `❓ ${faqAnswers[faqKey]}`,
            Markup.inlineKeyboard([
                [Markup.button.callback("⬅️ Назад до FAQ", "frequent_questions")]
            ])
        );
    });
});

bot.action("our_services", async (ctx) => {
    try {
        if (ctx.callbackQuery.message) {
            await ctx.editMessageText("🏗 Наші послуги:", servicesMenu);
        } else {
            await ctx.reply("🏗 Наші послуги:", servicesMenu);
        }
    } catch (error) {
        console.error("❌ Error updating message:", error);
    }
});

Object.keys(servicesDetails).forEach((serviceKey) => {
    bot.action(serviceKey, async (ctx) => {
        await ctx.editMessageText(
            `📌 ${servicesDetails[serviceKey]}`,
            Markup.inlineKeyboard([
                [Markup.button.callback("⬅️ Назад до послуг", "our_services")]
            ])
        );
    });
});

const userPhoneNumbers = new Map();

const faqMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🏗 Наші послуги", "our_services")],
    [Markup.button.callback("💰 Ціни на пакети", "pricing")],
    [Markup.button.callback("❓ Часті запитання (FAQ)", "frequent_questions")],
    [Markup.button.callback("⬅️ Назад до головного меню", "main_menu")]
]);

const mainMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🟡 Новий сайт для ЖК / котеджного містечка", "new_site"), Markup.button.callback("🟡 Редизайн або доопрацювання сайту", "redesign")],
    [Markup.button.callback("🟡 Налаштування реклами (Google / Meta)", "ads"), Markup.button.callback("🟡 Підключення шахматки / CRM", "crm")],
    [Markup.button.callback("🟡 Безкоштовний аудит сайту / реклами", "audit"), Markup.button.callback("ℹ️ Послуги та FAQ", "faq")],
    [Markup.button.callback("ℹ️ Зв'язатись з менеджером", "request_phone")],
]);

async function sendMessageToKommo(userId, username, text, phone, nickname) {
    try {
        await axios.post(`https://tresortech.kommo.com/api/v4/leads`, [
            {
                name: `${text} ${username} (${nickname}) з телефоном ${phone}, ID в Telegram: ${userId}`,
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
                Authorization: `Bearer ${process.env.KOMMO_AUTH_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("❌ Помилка при відправці в Kommo:", error);
    }
}

bot.action("main_menu", async (ctx) => {
    await ctx.editMessageText(
        "🔝 Головне меню. Оберіть послугу:",
        mainMenu
    );
});

bot.action("faq", async (ctx) => {
    try {
        if (ctx.callbackQuery.message) {
            await ctx.editMessageText("ℹ️ Послуги та FAQ:", faqMenu);
        } else {
            await ctx.reply("ℹ️ Послуги та FAQ:", faqMenu);
        }
    } catch (error) {
        console.error("❌ Error updating message:", error);
    }
});

bot.action("request_phone", async (ctx) => {
    const userId = ctx.from.id;
    if (!userPhoneNumbers.has(userId)) {
        await ctx.reply(
            "Будь ласка, поділіться своїм номером телефону для зв'язку з менеджером.",
            Markup.keyboard([
                Markup.button.contactRequest("📞 Надати номер телефону")
            ]).resize().oneTime()
        );
    } else {
        await ctx.reply(
            "Запит на зв'язок з менеджером оформлено успішно! Для того щоб зв'язатись з менеджером, перейдіть у створену чат кімнату та опишіть свою проблему.",
            Markup.inlineKeyboard([
                Markup.button.url("Перейти у чат кімнату", "https://t.me/landing_ua_manager_chat_bot")
            ])
        );
    }
});

bot.on("contact", async (ctx) => {
    const userId = ctx.from.id;
    const userPhone = ctx.message.contact.phone_number;
    userPhoneNumbers.set(userId, userPhone);

    await ctx.reply(
        "Запит на зв'язок з менеджером оформлено успішно! Для того щоб зв'язатись з менеджером, перейдіть у створену чат кімнату та опишіть свою проблему.",
        Markup.inlineKeyboard([
            Markup.button.url("Перейти у чат кімнату", "https://t.me/landing_ua_manager_chat_bot")
        ])
    );
});

function createServiceMenu(serviceAction) {
    return Markup.inlineKeyboard([
        [Markup.button.callback("📞 Замовити послугу", serviceAction)],
        [Markup.button.callback("⬅️ Назад до Головного Меню", "main_menu")]
    ]);
}

async function processServiceRequest(ctx, serviceText) {
    const userId = ctx.from.id;
    const userPhone = userPhoneNumbers.get(userId);

    if (!userPhone) {
        await ctx.reply(
            "Для оформлення замовлення, будь ласка, поділіться своїм номером телефону.",
            Markup.keyboard([
                Markup.button.contactRequest("📞 Надати номер телефону")
            ]).resize().oneTime()
        );
    } else {
        const userName = ctx.from.first_name || "Невідомий";
        const userUsername = ctx.from.username ? `@${ctx.from.username}` : "Немає ніку";
        await sendMessageToKommo(userId, userName, serviceText, userPhone, userUsername);
        await ctx.reply("Дякую! Послугу замовлено! Найближчим часом з Вами зв'яжеться наш менеджер.");
    }
}

bot.action("new_site", async (ctx) => {
    await ctx.editMessageText("🔹 Ми створюємо сучасні та ефективні сайти під ключ для ЖК та котеджних містечок. Наші сайти адаптивні, швидкі та готові до просування.", createServiceMenu("new_site_request"));
});

bot.action("redesign", async (ctx) => {
    await ctx.editMessageText("🔹 Пропонуємо редизайн або доопрацювання вашого сайту для покращення конверсій та ефективності.", createServiceMenu("redesign_request"));
});

bot.action("ads", async (ctx) => {
    await ctx.editMessageText("🔹 Професійне налаштування реклами у Google та Meta для збільшення залучення клієнтів.", createServiceMenu("ads_request"));
});

bot.action("crm", async (ctx) => {
    await ctx.editMessageText("🔹 Інтегруємо шахматку або CRM-системи для автоматизації процесів продажу.", createServiceMenu("crm_request"));
});

bot.action("audit", async (ctx) => {
    await ctx.editMessageText("🔹 Проведемо безкоштовний аудит вашого сайту або рекламної кампанії та надамо рекомендації щодо покращення.", createServiceMenu("audit_request"));
});

bot.action(["new_site_request", "redesign_request", "ads_request", "crm_request", "audit_request"], async (ctx) => {
    const serviceMap = {
        "new_site_request": "Новий сайт для ЖК",
        "redesign_request": "Редизайн сайту",
        "ads_request": "Налаштування реклами",
        "crm_request": "Підключення CRM",
        "audit_request": "Аудит сайту"
    };
    await processServiceRequest(ctx, serviceMap[ctx.match.input]);
});

bot.start(async (ctx) => {
    const userName = ctx.from.first_name || "користувач";
    await ctx.reply(`Привіт, ${userName}! Дякую, що користуєтесь нашим ботом, він може допомогти Вам у всіх Ваших питаннях. 👋 Оберіть послугу:`, mainMenu);
});

module.exports = bot;