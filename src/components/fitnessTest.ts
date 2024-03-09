import { Markup } from 'telegraf';
import { upsertUser } from '../database/database';
import { userStates } from '../index';
import { ACTIVITY_HIGH, ACTIVITY_MEDIUM, ACTIVITY_NONE, ACTIVITY_VERY_HIGH, GOAL_GAIN_WEIGHT, GOAL_LOSE_WEIGHT, GOAL_MAINTAIN_WEIGHT, SET_GENDER_FEMALE, SET_GENDER_MALE, START_TEST, UserState } from '../types';
import { animateThinking, delay } from '../utils/helpers';

export function updateState(userId: string, updates: Partial<UserState>) {
    const currentState = userStates.get(userId) || { step: 1 };
    const newState = { ...currentState, ...updates };
    userStates.set(userId, newState);
}

export const startTest = (ctx: any) => {
    const userId = ctx.from.id.toString();
    userStates.set(userId, { step: 1 });
    ctx.reply('Какой у вас пол?', Markup.inlineKeyboard([
        Markup.button.callback('Я - мужчина', SET_GENDER_MALE),
        Markup.button.callback('Я - женщина', SET_GENDER_FEMALE)
    ]));
};

export function registerFitnessTestActions(bot: any) {
    bot.action(START_TEST, startTest);

    bot.action(SET_GENDER_MALE, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { gender: 'Мужчина', step: 2 });
        askGoal(ctx);
    });

    bot.action(SET_GENDER_FEMALE, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { gender: 'Женщина', step: 2 });
        askGoal(ctx);
    });

    bot.action(GOAL_LOSE_WEIGHT, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { goal: 'Похудеть', step: 3 });
        askAge(ctx);
    });

    bot.action(GOAL_MAINTAIN_WEIGHT, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { goal: 'Держать свой вес', step: 3 });
        askAge(ctx);
    });

    bot.action(GOAL_GAIN_WEIGHT, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { goal: 'Набрать вес', step: 3 });
        askAge(ctx);
    });

    // Добавляем обработку выбора уровня активности
    bot.action(ACTIVITY_NONE, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Ничем не занимаюсь', step: 7 });
        askHealthIssues(ctx);
    });

    bot.action(ACTIVITY_MEDIUM, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Средняя активность', step: 7 });
        askHealthIssues(ctx);
    });

    bot.action(ACTIVITY_HIGH, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Высокий уровень', step: 7 });
        askHealthIssues(ctx);
    });

    bot.action(ACTIVITY_VERY_HIGH, (ctx: any) => {
        const userId = ctx.from.id.toString();
        updateState(userId, { activity: 'Очень активный', step: 7 });
        askHealthIssues(ctx);
    });

    bot.on('text', async (ctx: any) => {
        const userId = ctx.from.id.toString();
        const state = userStates.get(userId);

        if (!state) return;

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
                ctx.reply('Составляем программу, пара минут 🥑').then(async ({ message_id }: any) => {
                    await animateThinking("Составляем программу, пара минут ", ctx, message_id);
                    await delay(6500);

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

                        await upsertUser(userData);
                        ctx.reply(qMsg);
                    } catch (error) {
                        console.error('Ошибка при сохранении данных пользователя:', error);
                        ctx.reply('Произошла ошибка при сохранении ваших данных. Пожалуйста, попробуйте ещё раз.');
                    }
                    userStates.delete(userId);
                });
                break;
        }
    });
}

const askGoal = (ctx: any) => {
    ctx.reply('Какая у тебя цель?', Markup.inlineKeyboard([
        [Markup.button.callback('Похудеть', GOAL_LOSE_WEIGHT)],
        [Markup.button.callback('Держать свой вес', GOAL_MAINTAIN_WEIGHT)],
        [Markup.button.callback('Набрать вес', GOAL_GAIN_WEIGHT)]
    ]));
}

const askAge = (ctx: any) => {
    ctx.reply('Сколько тебе лет?');
}

// Эта функция вызывается после того, как пользователь ответил на вопрос о росте
const askActivityLevel = (ctx: any) => {
    ctx.reply('Какой уровень активности?\n\n🥑 Средняя активность, 1-2 раза в неделю занимаюсь спортом\n🥑 Высокий уровень 3-5 дней в неделю занимаюсь спортом\n🥑 Очень активный 6-7 дней в неделю занимаюсь спортом', Markup.inlineKeyboard([
        [Markup.button.callback('Ничем не занимаюсь', ACTIVITY_NONE)],
        [Markup.button.callback('Средняя активность', ACTIVITY_MEDIUM)],
        [Markup.button.callback('Высокий уровень', ACTIVITY_HIGH)],
        [Markup.button.callback('Очень активный', ACTIVITY_VERY_HIGH)]
    ]));
}

// Обработка ответа на вопрос о здоровье
function askHealthIssues(ctx: any) {
    ctx.reply('Есть ли аллергия, противопоказания по еде или заболевания?');
}