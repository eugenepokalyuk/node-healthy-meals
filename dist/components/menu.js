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
exports.registerFitnessMenuActions = void 0;
const telegraf_1 = require("telegraf");
const types_1 = require("../types");
const helpers_1 = require("../utils/helpers");
function registerFitnessMenuActions(bot) {
    const userStates = new Map();
    const setUserState = (userId, newState) => {
        userStates.set(userId, newState);
    };
    const getUserState = (userId) => {
        return userStates.get(userId) || {};
    };
    bot.action(types_1.SEND_PHOTO, (ctx) => __awaiter(this, void 0, void 0, function* () {
        const userId = ctx.from.id.toString();
        setUserState(userId, { expectingPhoto: true });
        yield ctx.reply('Отлично! Теперь, пожалуйста, отправьте фото вашего блюда.');
    }));
    bot.on('photo', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const userId = ctx.from.id.toString();
        const state = getUserState(userId);
        if (state.expectingPhoto) {
            const sentMessage = yield ctx.reply('Обрабатываем ваше фото 🥑');
            yield (0, helpers_1.animateThinking)("Обрабатываем ваше фото ", ctx, sentMessage.message_id);
            yield (0, helpers_1.delay)(6500);
            setUserState(userId, { expectingPhoto: false });
            const msg = 'Судя по фотографии, у нас довольно большое разнообразие! Вот список того, что я вижу, и примерное содержание калорий для каждого продукта: \n\nЦельные яйца: В одном большом яйце содержится около 70 калорий. \nМногозерновой хлеб: В зависимости от сорта хлеба, калорийность двух ломтиков может составлять от 160 до 200 калорий. \nХумус: Столовая ложка хумуса содержит примерно 25 калорий, но, похоже, на каждом ломтике хлеба может быть около 2 столовых ложек, так что в целом получается около 100 калорий. \nСыр Чеддер: Один средний ломтик содержит около 60 калорий. \nКукуруза и зелень (скорее всего, петрушка или кинза): Полчашки кукурузы содержит около 80 калорий, а зелени - ничтожно мало.\nМаринованный огурец: Огурцы содержат мало калорий, обычно около 5-10 калорий каждый, в зависимости от размера.\nАвокадо: Типичная порция авокадо (1/5 целого) составляет около 50 калорий, но здесь, похоже, около половины авокадо, так что примерно 125-150 калорий.\n\nСложив их, мы получим:\nЯйца: 70 калорий\nМногозерновой хлеб: ~180 калорий\nХуммус: ~100 калорий\nСыр Чеддер: 60 калорий\nКукуруза и зелень: ~80 калорий\nМаринованный огурчик: ~10 калорий\nАвокадо: ~140 калорий\nВ общей сложности в тарелке, по приблизительным подсчетам, содержится около 640 калорий. Пожалуйста, имейте в виду, что это приблизительные данные, и фактическая калорийность может варьироваться в зависимости от размера порций и используемых продуктов.';
            yield ctx.reply(`Ваше блюдо успешно обработано!\n\n${msg}\n\nЕсли я неверно определил блюдо лучше переснять!`);
        }
    }));
    bot.action(types_1.EDIT_DATA, (ctx) => {
        ctx.reply('*Пока просто показываю*\n\nХочу изменить:', telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('Пол', types_1.CHANGE_GENDER), telegraf_1.Markup.button.callback('Цель', types_1.CHANGE_GOAL)],
            [telegraf_1.Markup.button.callback('Возраст', types_1.CHANGE_AGE)],
            [telegraf_1.Markup.button.callback('Вес', types_1.CHANGE_WEIGHT), telegraf_1.Markup.button.callback('Рост', types_1.CHANGE_HEIGHT)],
            [telegraf_1.Markup.button.callback('Уровень активности', types_1.CHANGE_ACTIVITY)],
            [telegraf_1.Markup.button.callback('Противопоказания', types_1.CHANGE_HEALTH_ISSUES)],
            [telegraf_1.Markup.button.callback('Назад', types_1.GO_BACK)]
        ]));
    });
    bot.action(types_1.CHANGE_GENDER, (ctx) => {
        setUserState(ctx.from.id, { awaiting: 'gender' });
        ctx.reply('Выберите ваш пол:', telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback('Я - Мужчина', types_1.SET_GENDER_MALE)],
            [telegraf_1.Markup.button.callback('Я - Женщина', types_1.SET_GENDER_FEMALE)]
        ]));
    });
    bot.action(types_1.CHANGE_GOAL, (ctx) => { });
    bot.action(types_1.CHANGE_AGE, (ctx) => { });
    bot.action(types_1.CHANGE_WEIGHT, (ctx) => { });
    bot.action(types_1.CHANGE_HEIGHT, (ctx) => { });
    bot.action(types_1.CHANGE_ACTIVITY, (ctx) => { });
    bot.action(types_1.CHANGE_HEALTH_ISSUES, (ctx) => { });
    bot.action(types_1.GO_BACK, (ctx) => {
        // Handle going back to the main menu
        // This could mean simply re-displaying the main menu options
    });
}
exports.registerFitnessMenuActions = registerFitnessMenuActions;
