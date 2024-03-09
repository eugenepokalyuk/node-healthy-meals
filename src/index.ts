import "dotenv/config.js";
import { Markup, Telegraf } from 'telegraf';
import { registerFitnessTestActions } from './components/fitnessTest';
import { registerFitnessMenuActions } from "./components/menu";
import { checkUserExists, setupDb } from './database/database';
import { EDIT_DATA, SEND_PHOTO, START_TEST, UserState } from './types';

export const bot = new Telegraf(process.env.BOT_TOKEN!);
export const userStates = new Map<string, UserState>();

bot.start(async (ctx) => {
    const userId: string = ctx.from.id.toString();
    await setupDb();

    const userExists = await checkUserExists(userId);

    if (userExists) {
        ctx.reply('Привет! Я – фитнесс помощник Трейни.\nРад снова тебя видеть!\n\nВыберите действие:', Markup.inlineKeyboard([
            [Markup.button.callback('🥑 Прислать фото блюда', SEND_PHOTO)],
            [Markup.button.callback('✏️ Изменить данные', EDIT_DATA)],
            [Markup.button.callback('🔄 Пройти тест снова', START_TEST)]
        ]));
    } else {
        ctx.replyWithMarkdown('Привет! Я – фитнесс помощник Трейни.\nНапишу тебе программу питания и помогу ее корректировать при необходимости.\n\nНо прежде чем начнем расскажи о себе.',
            Markup.inlineKeyboard([
                Markup.button.callback('Начать тест', START_TEST)
            ])
        );
    }
});

registerFitnessTestActions(bot);
registerFitnessMenuActions(bot);

setupDb().then(() => {
    bot.launch();
    console.log('Бот успешно запущен');
});