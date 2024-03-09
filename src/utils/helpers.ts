export const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
export const animateThinking = async (msg: string, ctx: any, messageId: any, dots = 1, iterations = 3, invisibleCounter = 1) => {
    if (iterations === 0) {
        return;
    }
    // Constructing the message text with dots and avocados
    let text = msg + '🥑'.repeat(dots) + "\u00A0".repeat(invisibleCounter % 2);
    try {
        await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined, text, { parse_mode: 'Markdown' });
    } catch (error) {
        console.log('Не удалось обновить сообщение, возможно, оно не изменилось:', error);
    }

    // Using setTimeout with async callback
    setTimeout(async () => {
        if (dots < 3) {
            await animateThinking(msg, ctx, messageId, dots + 1, iterations, invisibleCounter + 1);
        } else {
            await animateThinking(msg, ctx, messageId, 1, iterations - 1, invisibleCounter + 1);
        }
    }, 500);
}