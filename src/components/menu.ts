import { Context, Markup, Telegraf } from 'telegraf';
import { CHANGE_ACTIVITY, CHANGE_AGE, CHANGE_GENDER, CHANGE_GOAL, CHANGE_HEALTH_ISSUES, CHANGE_HEIGHT, CHANGE_WEIGHT, EDIT_DATA, GO_BACK, SEND_PHOTO, SET_GENDER_FEMALE, SET_GENDER_MALE } from "../types";
import { animateThinking, delay } from '../utils/helpers';

export function registerFitnessMenuActions(bot: Telegraf<Context>) {
    const userStates = new Map<string | number, any>();
    const setUserState = (userId: string | number, newState: any) => {
        userStates.set(userId, newState);
    };

    const getUserState = (userId: string | number) => {
        return userStates.get(userId) || {};
    };
    bot.action(SEND_PHOTO, async (ctx: any) => {
        const userId = ctx.from.id.toString();
        setUserState(userId, { expectingPhoto: true });

        await ctx.reply('Отлично! Теперь, пожалуйста, отправьте фото вашего блюда.');
    });

    bot.on('photo', async (ctx: any) => {
        const userId = ctx.from.id.toString();
        const state = getUserState(userId);
        if (state.expectingPhoto) {
            const sentMessage = await ctx.reply('Обрабатываем ваше фото 🥑');

            await animateThinking("Обрабатываем ваше фото ", ctx, sentMessage.message_id);
            await delay(6500);

            setUserState(userId, { expectingPhoto: false });
            const msg = 'Судя по фотографии, у нас довольно большое разнообразие! Вот список того, что я вижу, и примерное содержание калорий для каждого продукта: \n\nЦельные яйца: В одном большом яйце содержится около 70 калорий. \nМногозерновой хлеб: В зависимости от сорта хлеба, калорийность двух ломтиков может составлять от 160 до 200 калорий. \nХумус: Столовая ложка хумуса содержит примерно 25 калорий, но, похоже, на каждом ломтике хлеба может быть около 2 столовых ложек, так что в целом получается около 100 калорий. \nСыр Чеддер: Один средний ломтик содержит около 60 калорий. \nКукуруза и зелень (скорее всего, петрушка или кинза): Полчашки кукурузы содержит около 80 калорий, а зелени - ничтожно мало.\nМаринованный огурец: Огурцы содержат мало калорий, обычно около 5-10 калорий каждый, в зависимости от размера.\nАвокадо: Типичная порция авокадо (1/5 целого) составляет около 50 калорий, но здесь, похоже, около половины авокадо, так что примерно 125-150 калорий.\n\nСложив их, мы получим:\nЯйца: 70 калорий\nМногозерновой хлеб: ~180 калорий\nХуммус: ~100 калорий\nСыр Чеддер: 60 калорий\nКукуруза и зелень: ~80 калорий\nМаринованный огурчик: ~10 калорий\nАвокадо: ~140 калорий\nВ общей сложности в тарелке, по приблизительным подсчетам, содержится около 640 калорий. Пожалуйста, имейте в виду, что это приблизительные данные, и фактическая калорийность может варьироваться в зависимости от размера порций и используемых продуктов.';
            await ctx.reply(`Ваше блюдо успешно обработано!\n\n${msg}\n\nЕсли я неверно определил блюдо лучше переснять!`);
        }
    });
    bot.action(EDIT_DATA, (ctx: any) => {
        ctx.reply('*Пока просто показываю*\n\nХочу изменить:', Markup.inlineKeyboard([
            [Markup.button.callback('Пол', CHANGE_GENDER), Markup.button.callback('Цель', CHANGE_GOAL)],
            [Markup.button.callback('Возраст', CHANGE_AGE)],
            [Markup.button.callback('Вес', CHANGE_WEIGHT), Markup.button.callback('Рост', CHANGE_HEIGHT)],
            [Markup.button.callback('Уровень активности', CHANGE_ACTIVITY)],
            [Markup.button.callback('Противопоказания', CHANGE_HEALTH_ISSUES)],
            [Markup.button.callback('Назад', GO_BACK)]
        ]));
    });

    bot.action(CHANGE_GENDER, (ctx: any) => {
        setUserState(ctx.from.id, { awaiting: 'gender' });
        ctx.reply('Выберите ваш пол:', Markup.inlineKeyboard([
            [Markup.button.callback('Я - Мужчина', SET_GENDER_MALE)],
            [Markup.button.callback('Я - Женщина', SET_GENDER_FEMALE)]
        ]));
    });

    bot.action(CHANGE_GOAL, (ctx: any) => {/* Handle change goal */ });
    bot.action(CHANGE_AGE, (ctx: any) => {/* Handle change age */ });
    bot.action(CHANGE_WEIGHT, (ctx: any) => {/* Handle change weight */ });
    bot.action(CHANGE_HEIGHT, (ctx: any) => {/* Handle change height */ });
    bot.action(CHANGE_ACTIVITY, (ctx: any) => {/* Handle change activity level */ });
    bot.action(CHANGE_HEALTH_ISSUES, (ctx: any) => {/* Handle change health issues */ });
    bot.action(GO_BACK, (ctx: any) => {
        // Handle going back to the main menu
        // This could mean simply re-displaying the main menu options
    });
}