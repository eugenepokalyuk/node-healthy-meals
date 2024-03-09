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
exports.registerFitnessTestActions = exports.startTest = exports.updateState = void 0;
const telegraf_1 = require("telegraf");
const database_1 = require("../database/database");
const index_1 = require("../index");
const types_1 = require("../types");
const helpers_1 = require("../utils/helpers");
function updateState(userId, updates) {
    const currentState = index_1.userStates.get(userId) || { step: 1 };
    const newState = Object.assign(Object.assign({}, currentState), updates);
    index_1.userStates.set(userId, newState);
}
exports.updateState = updateState;
const startTest = (ctx) => {
    const userId = ctx.from.id.toString();
    index_1.userStates.set(userId, { step: 1 });
    ctx.reply('Какой у вас пол?', telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('Я - мужчина', types_1.SET_GENDER_MALE),
        telegraf_1.Markup.button.callback('Я - женщина', types_1.SET_GENDER_FEMALE)
    ]));
};
exports.startTest = startTest;
function registerFitnessTestActions(bot) {
    bot.action(types_1.START_TEST, exports.startTest);
    bot.action(types_1.SET_GENDER_MALE, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { gender: 'Мужчина', step: 2 });
        askGoal(ctx);
    });
    bot.action(types_1.SET_GENDER_FEMALE, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { gender: 'Женщина', step: 2 });
        askGoal(ctx);
    });
    bot.action(types_1.GOAL_LOSE_WEIGHT, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { goal: 'Похудеть', step: 3 });
        askAge(ctx);
    });
    bot.action(types_1.GOAL_MAINTAIN_WEIGHT, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { goal: 'Держать свой вес', step: 3 });
        askAge(ctx);
    });
    bot.action(types_1.GOAL_GAIN_WEIGHT, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { goal: 'Набрать вес', step: 3 });
        askAge(ctx);
    });
    // Добавляем обработку выбора уровня активности
    bot.action(types_1.ACTIVITY_NONE, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Ничем не занимаюсь', step: 7 });
        askHealthIssues(ctx);
    });
    bot.action(types_1.ACTIVITY_MEDIUM, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Средняя активность', step: 7 });
        askHealthIssues(ctx);
    });
    bot.action(types_1.ACTIVITY_HIGH, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Высокий уровень', step: 7 });
        askHealthIssues(ctx);
    });
    bot.action(types_1.ACTIVITY_VERY_HIGH, (ctx) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Очень активный', step: 7 });
        askHealthIssues(ctx);
    });
    bot.on('text', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const userId = ctx.from.id.toString();
        const state = index_1.userStates.get(userId);
        if (!state)
            return;
        switch (state.step) {
            case 3: // Вопрос о возрасте
                if (!/^\d{1,2}$/.test(ctx.message.text)) {
                    ctx.reply('Пожалуйста, введите возраст цифрами');
                    return;
                }
                updateState(userId, { age: parseInt(ctx.message.text), step: 4 });
                ctx.reply('Какой у тебя вес в килограмах?');
                break;
            case 4: // Вопрос о весе
                if (!/^\d{1,3}$/.test(ctx.message.text)) {
                    ctx.reply('Пожалуйста, введите вес цифрами');
                    return;
                }
                updateState(userId, { weight: parseInt(ctx.message.text), step: 5 });
                ctx.reply('Какой у тебя рост в сантиметрах?');
                break;
            case 5: // Вопрос о росте
                if (!/^\d{1,3}$/.test(ctx.message.text)) {
                    ctx.reply('Пожалуйста, введите рост цифрами');
                    return;
                }
                updateState(userId, { height: parseInt(ctx.message.text), step: 6 });
                askActivityLevel(ctx); // Переходим к вопросу об уровне активности
                break;
            case 7: // Вопрос о здоровье
                updateState(userId, { healthIssues: ctx.message.text });
                ctx.reply('Составляем программу, пара минут 🥑').then((_a) => __awaiter(this, [_a], void 0, function* ({ message_id }) {
                    yield (0, helpers_1.animateThinking)("Составляем программу, пара минут ", ctx, message_id);
                    yield (0, helpers_1.delay)(6500);
                    const userData = {
                        telegram_id: userId,
                        gender: state.gender,
                        goal: state.goal,
                        age: state.age,
                        weight: state.weight,
                        height: state.height,
                        activity_level: state.activity,
                        health_issues: ctx.message.text
                    };
                    try {
                        const qMsg = 'Ваш Индекс Массы Тела (ИМТ) составляет примерно 26.5, что попадает в категорию "Избыточный вес". Обычно нормальный ИМТ находится в диапазоне от 18.5 до 24.9.\nБазальный Метаболический Расход (БМР) равен 2127.5 калорий в день. Это количество энергии, которое ваше тело тратит в состоянии покоя для поддержания основных жизненных функций.\nВаш Общий Дневной Энергетический Расход (ОДЭР), учитывая низкий уровень активности, составляет приблизительно 2553 калорий в день. Это означает, что для поддержания текущего веса вашему организму требуется около этого количества калорий ежедневно.\nЧтобы создать дефицит в 700 калорий от вашего ОДЭР для похудения, ваша целевая калорийность на день должна составлять около 1853 калорий. Давайте разработаем план питания на основе этого показателя.\nПотребление жидкости: Рекомендуется пить около 30-35 мл воды на каждый килограмм веса тела. Для вас это будет примерно 3120 - 3640 мл (3.1 - 3.6 литра) воды в день.';
                        yield (0, database_1.upsertUser)(userData);
                        ctx.reply(qMsg);
                    }
                    catch (error) {
                        console.error('Ошибка при сохранении данных пользователя:', error);
                        ctx.reply('Произошла ошибка при сохранении ваших данных. Пожалуйста, попробуйте ещё раз.');
                    }
                    index_1.userStates.delete(userId);
                }));
                break;
        }
    }));
}
exports.registerFitnessTestActions = registerFitnessTestActions;
const askGoal = (ctx) => {
    ctx.reply('Какая у тебя цель?', telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('Похудеть', types_1.GOAL_LOSE_WEIGHT)],
        [telegraf_1.Markup.button.callback('Держать свой вес', types_1.GOAL_MAINTAIN_WEIGHT)],
        [telegraf_1.Markup.button.callback('Набрать вес', types_1.GOAL_GAIN_WEIGHT)]
    ]));
};
const askAge = (ctx) => {
    ctx.reply('Сколько тебе лет?');
};
// Эта функция вызывается после того, как пользователь ответил на вопрос о росте
const askActivityLevel = (ctx) => {
    ctx.reply('Какой уровень активности?\n\n🥑 Средняя активность, 1-2 раза в неделю занимаюсь спортом\n🥑 Высокий уровень 3-5 дней в неделю занимаюсь спортом\n🥑 Очень активный 6-7 дней в неделю занимаюсь спортом', telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('Ничем не занимаюсь', types_1.ACTIVITY_NONE)],
        [telegraf_1.Markup.button.callback('Средняя активность', types_1.ACTIVITY_MEDIUM)],
        [telegraf_1.Markup.button.callback('Высокий уровень', types_1.ACTIVITY_HIGH)],
        [telegraf_1.Markup.button.callback('Очень активный', types_1.ACTIVITY_VERY_HIGH)]
    ]));
};
// Обработка ответа на вопрос о здоровье
function askHealthIssues(ctx) {
    ctx.reply('Есть ли аллергия, противопоказания по еде или заболевания?');
}
