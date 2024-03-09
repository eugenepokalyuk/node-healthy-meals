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
exports.animateThinking = exports.delay = void 0;
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.delay = delay;
// export const animateThinking = async (msg: string, ctx: any, messageId: any, dots = 1, iterations = 3, invisibleCounter = 1) => {
//     if (iterations === 0) {
//         return;
//     }
//     // Добавляем неразрывные пробелы
//     let text = msg + '🥑'.repeat(dots) + "\u00A0".repeat(invisibleCounter % 2);
//     try {
//         await ctx.telegram.reply(ctx.chat.id, messageId, undefined, text);
//     } catch (error) {
//         console.log('Не удалось обновить сообщение, возможно, оно не изменилось');
//     }
//     setTimeout(() => {
//         if (dots < 3) {
//             animateThinking(ctx, messageId, dots + 1, iterations, invisibleCounter + 1);
//         } else {
//             animateThinking(ctx, messageId, 1, iterations - 1, invisibleCounter + 1);
//         }
//     }, 500);
// }
const animateThinking = (msg_1, ctx_1, messageId_1, ...args_1) => __awaiter(void 0, [msg_1, ctx_1, messageId_1, ...args_1], void 0, function* (msg, ctx, messageId, dots = 1, iterations = 3, invisibleCounter = 1) {
    if (iterations === 0) {
        return;
    }
    // Constructing the message text with dots and avocados
    let text = msg + '🥑'.repeat(dots) + "\u00A0".repeat(invisibleCounter % 2);
    try {
        yield ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined, text, { parse_mode: 'Markdown' });
    }
    catch (error) {
        console.log('Не удалось обновить сообщение, возможно, оно не изменилось:', error);
    }
    // Using setTimeout with async callback
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        if (dots < 3) {
            yield (0, exports.animateThinking)(msg, ctx, messageId, dots + 1, iterations, invisibleCounter + 1);
        }
        else {
            yield (0, exports.animateThinking)(msg, ctx, messageId, 1, iterations - 1, invisibleCounter + 1);
        }
    }), 500);
});
exports.animateThinking = animateThinking;
