"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStates = exports.bot = void 0;
require("dotenv/config.js");
const telegraf_1 = require("telegraf");
const fitnessTest_1 = require("./components/fitnessTest");
const menu_1 = require("./components/menu");
const database_1 = require("./database/database");
const types_1 = require("./types");
exports.bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.userStates = new Map();
exports.bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = ctx.from.id.toString();
    yield (0, database_1.setupDb)();
    const userExists = yield (0, database_1.checkUserExists)(userId);
    if (userExists) {
        ctx.reply('Привет! Я – фитнесс помощник Трейни.\nРад снова тебя видеть!\n\nВыберите действие:', telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('🥑 Прислать фото блюда', types_1.SEND_PHOTO)],
            [telegraf_1.Markup.button.callback('✏️ Изменить данные', types_1.EDIT_DATA)],
            [telegraf_1.Markup.button.callback('🔄 Пройти тест снова', types_1.START_TEST)]
        ]));
    }
    else {
        ctx.replyWithMarkdown('Привет! Я – фитнесс помощник Трейни.\nНапишу тебе программу питания и помогу ее корректировать при необходимости.\n\nНо прежде чем начнем расскажи о себе.', telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback('Начать тест', types_1.START_TEST)
        ]));
    }
}));
(0, fitnessTest_1.registerFitnessTestActions)(exports.bot);
(0, menu_1.registerFitnessMenuActions)(exports.bot);
(0, database_1.setupDb)().then(() => {
    exports.bot.launch();
    console.log('Бот успешно запущен');
});
