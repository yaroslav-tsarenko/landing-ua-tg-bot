require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((err, ctx) => {
    console.error(`❌ Помилка у бота:`, err);
    ctx.reply("⚠️ Виникла помилка. Спробуйте ще раз.");
});


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
        "🔹 Landing Page — $1,500\n" +
        "🔹 Advanced Website — від $3,500\n" +
        "🔹 Premium Real Estate — від $6,500\n" +
        "🔹 Шахматка Flatris — $800\n" +
        "🔹 CRM + Автоматизація — $950\n" +
        "🔹 Підтримка сайту — від $300/міс\n" +
        "🔹 Рекламна стратегія (разово) — $1,000",

    "service_marketing": "💰 Маркетингове супроводження (ретейнери):\n\n" +
        "🔹 Базовий — $1,500/міс\n" +
        "🔹 Розширений — $2,400/міс\n" +
        "🔹 Преміум — $4,000/міс",

    "service_individual": "💰 Окремі послуги:\n\n" +
        "🔹 Таргет + Контекст — від $1,200/міс\n" +
        "🔹 SEO-просування — від $900/міс\n" +
        "🔹 SMM — від $950/міс\n" +
        "🔹 3D Basic — $1,200\n" +
        "🔹 3D Premium — $2,000",

    "service_branding": "💰 Брендинг:\n\n" +
        "🔹 Базовий брендинг — $1,200\n" +
        "🔹 Розширений брендинг — $2,000\n" +
        "🔹 Преміум брендинг — $3,000"
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

const crmKommoMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Замовити послугу", "crm_kommo_request")],
    [Markup.button.callback("⬅️ Назад до інтеграцій", "crm")]
]);

const sendpulseMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Замовити послугу", "sendpulse_request")],
    [Markup.button.callback("⬅️ Назад до інтеграцій", "crm")]
]);

const ringostatMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Замовити послугу", "ringostat_request")],
    [Markup.button.callback("⬅️ Назад до інтеграцій", "crm")]
]);

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
    [Markup.button.callback("⬅️ Повернутись назад", "main_menu")]
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

const landingPageMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Залишити заявку", "landing_page_request")],
    [Markup.button.callback("🔙 Назад до меню", "site_development_menu")]
]);

const newHousingSiteMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Залишити заявку", "new_housing_site_request")],
    [Markup.button.callback("🔙 Назад до меню", "site_development_menu")]
]);

const siteRedesignMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Залишити заявку", "site_redesign_request")],
    [Markup.button.callback("🔙 Назад до меню", "site_development_menu")]
]);

bot.action("landing_page", async (ctx) => {
    await ctx.editMessageText(
        "📄 Створюємо ефективні Landing Page для запуску реклами та збору лідів:\n" +
        "- Аналізуємо конкурентів і ваш об'єкт на ринку\n" +
        "- Пропрацьовуємо всі тексти і структуру (UX)\n" +
        "- Створюємо індивідуальний адаптивний дизайн (UI)\n" +
        "- Перетворюємо дизайн у робочий сайт на Webflow або WordPress\n" +
        "- Налаштовуємо форми, оптимізуємо швидкість завантаження, фінальна перевірка якості\n" +
        "- Проводимо базову SEO-оптимізацію\n" +
        "- 1 рік хостингу та домен у подарунок\n\n" +
        "💵 Орієнтовна вартість: від $1,500\n" +
        "📅 Термін: 3 тижні\n" +
        "📌 Остаточна вартість залежить від контенту та складності",
        landingPageMenu
    );
});

bot.action("new_housing_site", async (ctx) => {
    await ctx.editMessageText(
        "🏗 Комплексна розробка сайту під ключ:\n" +
        "- Аналіз конкурентів, УТП, планування структури сайту\n" +
        "- Написання текстів, що продають, з урахуванням цільової аудиторії\n" +
        "- Розробка сучасного дизайну з урахуванням айдентики та брендбуку\n" +
        "- Адаптивна верстка на Webflow або WordPress (до 10 сторінок)\n" +
        "- SEO-базова оптимізація, підключення аналітики та швидке завантаження\n" +
        "- Хостинг, домен, базова технічна підтримка протягом 1 місяця\n\n" +
        "💵 Орієнтовна вартість: від $3,500\n" +
        "📅 Термін: 4–5 тижнів\n" +
        "📌 Остаточна ціна визначається після консультації та брифінгу",
        newHousingSiteMenu
    );
});

bot.action("site_redesign", async (ctx) => {
    await ctx.editMessageText(
        "🔁 Повне оновлення сайту з урахуванням сучасних стандартів:\n" +
        "- Аналіз поточного сайту, UX-аудит, виявлення слабких місць\n" +
        "- Розробка нової структури та логіки взаємодії\n" +
        "- Дизайн з нуля або редизайн існуючого інтерфейсу\n" +
        "- Оптимізація швидкості, SEO, аналітика\n" +
        "- Впровадження нових функцій, блоків, форм\n\n" +
        "💵 Орієнтовна вартість: від $2,500\n" +
        "📌 Остаточна ціна визначається після аудиту сайту та обговорення задач",
        siteRedesignMenu
    );
});

const siteDevelopmentMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🟡 Розробка Landing Page", "landing_page")],
    [Markup.button.callback("🟡 Новий сайт для ЖК / котеджного містечка", "new_housing_site")],
    [Markup.button.callback("🟡 Редизайн або доопрацювання сайту", "site_redesign")],
    [Markup.button.callback("🔙 Назад до меню", "main_menu")]
]);

const mainMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🟡 Розробка сайтів", "new_site")],
    [Markup.button.callback("🟡 Налаштування реклами", "ads")],
    [Markup.button.callback("🟡 Інтеграції: CRM, шахматка, автоматизація", "crm")],
    [Markup.button.callback("🟡 Безкоштовний аудит сайту / реклами", "audit")],
    [Markup.button.callback("ℹ️ FAQ", "frequent_questions")],
    [Markup.button.callback("ℹ️ Зв'язатись з менеджером", "request_phone")],
]);

const googleAdsMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Замовити послугу", "google_ads_request")],
    [Markup.button.callback("⬅️ Назад до налаштування реклами", "ads")]
]);

const facebookAdsMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📞 Замовити послугу", "facebook_ads_request")],
    [Markup.button.callback("⬅️ Назад до налаштування реклами", "ads")]
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


async function processServiceRequest(ctx, serviceText) {
    const userId = ctx.from.id;
    const userPhone = userPhoneNumbers.get(userId);

    if (!userPhone) {
        ctx.session = ctx.session || {};
        ctx.session.pendingServiceRequest = { serviceText };

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

function createServiceMenu(serviceAction) {
    return Markup.inlineKeyboard([
        [Markup.button.callback("📞 Замовити послугу", serviceAction)],
        [Markup.button.callback("⬅️ Назад до Головного Меню", "main_menu")]
    ]);
}

bot.action("landing_page_request", async (ctx) => {
    await processServiceRequest(ctx, "Розробка Landing Page");
});

bot.action("new_housing_site_request", async (ctx) => {
    await processServiceRequest(ctx, "Новий сайт для ЖК / котеджного містечка");
});

bot.action("site_redesign_request", async (ctx) => {
    await processServiceRequest(ctx, "Редизайн або доопрацювання сайту");
});

bot.action("site_development_menu", async (ctx) => {
    await ctx.editMessageText("Оберіть тип розробки сайту:", siteDevelopmentMenu);
});

bot.action("new_site", async (ctx) => {
    await ctx.editMessageText("Оберіть тип розробки сайту:", siteDevelopmentMenu);
});

bot.action("redesign", async (ctx) => {
    await ctx.editMessageText("🔹 Пропонуємо редизайн або доопрацювання вашого сайту для покращення конверсій та ефективності.", createServiceMenu("redesign_request"));
});

const adsMenu = Markup.inlineKeyboard([
    [Markup.button.callback("📱 Налаштування реклами Google Ads", "google_ads")],
    [Markup.button.callback("📱 Налаштування реклами Facebook/Meta", "facebook_ads")],
    [Markup.button.callback("⬅️ Назад до головного меню", "main_menu")]
]);

bot.action("ads", async (ctx) => {
    await ctx.editMessageText("Оберіть тип налаштування реклами:", adsMenu);
});


bot.action("google_ads", async (ctx) => {
    await ctx.editMessageText(
        "🔎 Запускаємо ефективну рекламу в Google Ads:\n" +
        "- Стратегія: пошукові, банерні, ремаркетинг\n" +
        "- Ключові слова, структура кампаній\n" +
        "- Адаптація під цільову аудиторію ЖК/нерухомості\n" +
        "- Налаштування аналітики, цілей, подій\n" +
        "- Регулярна звітність та оптимізація\n\n" +
        "💵 Вартість ведення: від $1,200/міс\n" +
        "📌 Остаточна ціна залежить від кількості кампаній і бюджету",
        googleAdsMenu
    );
});

bot.action("facebook_ads", async (ctx) => {
    await ctx.editMessageText(
        "📱 Запускаємо таргетовану рекламу для лідогенерації:\n" +
        "- Аналіз аудиторій: гео, інтереси, Lookalike\n" +
        "- Креативи (статичні, відео, анімації)\n" +
        "- Написання рекламних текстів і УТП\n" +
        "- Налаштування пікселя, цілей і аналітики\n" +
        "- Постійна оптимізація результатів\n\n" +
        "💵 Вартість ведення: від $1,200/міс\n" +
        "📌 Залежить від кількості напрямків та бюджету",
        facebookAdsMenu
    );
});

bot.action("google_ads_request", async (ctx) => {
    await processServiceRequest(ctx, "Налаштування реклами Google Ads");
});

bot.action("facebook_ads_request", async (ctx) => {
    await processServiceRequest(ctx, "Налаштування реклами Facebook/Meta");
});

const crmMenu = Markup.inlineKeyboard([
    [Markup.button.callback("🧩 Інтеграція CRM Kommo", "crm_kommo")],
    [Markup.button.callback("📤 Інтеграція з Sendpulse", "sendpulse")],
    [Markup.button.callback("📞 Інтеграція з RingoStat", "ringostat")],
    [Markup.button.callback("⬅️ Назад до головного меню", "main_menu")]
]);

bot.action("crm", async (ctx) => {
    await ctx.editMessageText("Оберіть тип інтеграції:", crmMenu);
});



bot.action("crm_kommo", async (ctx) => {
    await ctx.editMessageText(
        "🧩 Підключимо CRM Kommo:\n" +
        "- Впровадження воронки під забудовника\n" +
        "- Створення етапів продажу та аналітики\n" +
        "- Інтеграція із сайтом, формами, ботами\n" +
        "- Автоматичні задачі, SMS/email, робочі процеси\n" +
        "- Автоматичне додавання заявок з форм на сайті в CRM\n" +
        "- Навчання вашої команди роботі з CRM\n\n" +
        "💵 Вартість: від $1,500 (разовий платіж)\n" +
        "📌 Точна ціна залежить від складності сценаріїв",
        crmKommoMenu
    );
});

bot.action("sendpulse", async (ctx) => {
    await ctx.editMessageText(
        "📤 Налаштуємо автоматичні листи, SMS, чат-ботів:\n" +
        "- Збір та передача лідів із сайту в базу\n" +
        "- Сценарії welcome-ланцюжків, нагадування\n" +
        "- Інтеграція із CRM та Telegram/Viber/email\n\n" +
        "💵 Вартість: від $1,200 (разовий платіж)\n" +
        "📌 Залежить від кількості каналів та глибини автоматизації",
        sendpulseMenu
    );
});

bot.action("ringostat", async (ctx) => {
    await ctx.editMessageText(
        "📞 Контроль дзвінків і ефективності реклами:\n" +
        "- Підключення calltracking та аналітики\n" +
        "- Інтеграція з CRM для фіксації всіх дзвінків\n" +
        "- Звіти по трафіку, запис розмов\n\n" +
        "💵 Вартість: від $800 (разовий платіж)\n" +
        "📌 В залежності від кількості номерів та інтеграцій",
        ringostatMenu
    );
});

bot.action("crm_kommo_request", async (ctx) => {
    await processServiceRequest(ctx, "Інтеграція CRM Kommo");
});

bot.action("sendpulse_request", async (ctx) => {
    await processServiceRequest(ctx, "Інтеграція з Sendpulse");
});

bot.action("ringostat_request", async (ctx) => {
    await processServiceRequest(ctx, "Інтеграція з RingoStat");
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
    const userId = ctx.from.id;

    if (!userPhoneNumbers.has(userId)) {
        await ctx.reply(
            `Привіт, ${userName}! Для того щоб повністю користуватись нашим ботом, потрібно щоб Ви поділились своїми контактними данними, це робиться для того щоб ми змогли зв'язатись з Вами, як тільки вам буде зручно.`,
            Markup.keyboard([
                Markup.button.contactRequest("📞 Надати номер телефону")
            ]).resize().oneTime()
        );
    } else {
        await ctx.reply(`Привіт, ${userName}! Дякуємо, що користуєтесь нашим ботом, він може допомогти Вам у всіх Ваших питаннях. 👋 Оберіть послугу:`, mainMenu);
    }
});

bot.on("contact", async (ctx) => {
    const userId = ctx.from.id;
    const userPhone = ctx.message.contact.phone_number;
    userPhoneNumbers.set(userId, userPhone);

    await ctx.reply("Дякую, ваш номер збережено, і в подальшому він буде використовуватись при замовленні послуг.");

    const userName = ctx.from.first_name || "користувач";
    await ctx.reply(`Привіт, ${userName}! Дякуємо, що користуєтесь нашим ботом, він може допомогти Вам у всіх Ваших питаннях. 👋 Оберіть послугу:`, mainMenu);
});

module.exports = bot;