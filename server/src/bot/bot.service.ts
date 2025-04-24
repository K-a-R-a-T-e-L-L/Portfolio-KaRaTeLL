import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import PQueue from 'p-queue';
import { PrismaService } from 'src/prisma/prisma.service';
import { keyboardType } from './types';

@Injectable()
export class BotService implements OnModuleInit {
    private bot: TelegramBot;
    private readonly chatID: number;
    private readonly queue = new PQueue({
        concurrency: 1,
        interval: 300
    });

    constructor(private readonly prisma: PrismaService) {
        this.chatID = parseInt(process.env.CHAT_ID as string) as number;
    };

    onModuleInit() {
        this.bot = new TelegramBot(process.env.TG_BOT_TOKEN as string, { polling: true });
        this.setupListeners();
        this.setCommands();
    };

    private async setCommands() {
        try {
            await this.bot.setMyCommands([
                { command: 'start', description: 'Запустить бота' },
                { command: 'get_senders', description: 'Получить всех отправителей' },
                { command: 'clear_records_db', description: 'Очистить базу данных' },
            ]);
        } catch (error) {
            console.log("Error when installing commands:", error);
        };
    };

    private async buttonMenu() {
        const keyboard: string[][] = [['Получить список отправителей', 'Очистить базу данных']];

        const options = {
            reply_markup: {
                keyboard: keyboard,
                resize_keyboard: true,
                one_time_keyboard: false
            }
        };

        let res = `🎉 Приветствую! 👋\nЗдесь ты можешь управлять входящими уведомлениями 📩.\n\n`;
        res += `• /get_senders - 📜 Получить список всех отправителей, которые когда-либо присылали сообщения.\n\n`;
        res += `• /clear_records_db - ⚠️ Очистить базу данных от всех записей о пользователях (будь осторожен!) 🗑️\n\n`;
        res += `• /start - 🔄 Перезапустить бота и начать с чистого листа ♻️`;

        this.enqueueMessage(this.chatID, res, options as any)
    };

    private splitMessage(message: string, maxLenght: number = 4096): string[] { //функция разделения сообщений на части по 4096 символов
        const parts: string[] = [];
        for (let i = 0; i < message.length; i += maxLenght) {
            parts.push(message.substring(i, i + maxLenght));
        };
        return parts;
    };

    private sendMessage(chat_id: number, message: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message> {  //функция отправки сообщения
        try {
            const executeResult = this.bot.sendMessage(chat_id, message, options);
            return executeResult;
        } catch (error) {
            console.log("Message sending error!!!");
            throw error;
        };
    };

    private editMessage(chat_id: number, message_id: number, text: string, options?: TelegramBot.EditMessageTextOptions) {
        this.bot.editMessageText(text, {
            chat_id: chat_id,
            message_id: message_id,
            ...options
        });
    };

    async enqueueMessage(chat_id: number, message: string, options?: TelegramBot.SendMessageOptions): Promise<number | null> {  //функция вызова sendMessage с задержкой в 300мс
        try {
            let messageID: null | number = null;
            await this.queue.add(async () => {
                try {
                    const executionResult = await this.sendMessage(chat_id, message, options);
                    console.log("The message has been sent");
                    messageID = executionResult.message_id;
                }
                catch (error) {
                    console.log("Message sending error!!!");
                    throw error;
                };
            });
            console.log("The message has been added to the queue!");
            return messageID;
        } catch (error) {
            console.error("Error when adding a task to the queue:", error);
            return null;
        }
    };

    private setupListeners() {
        this.bot.onText(/\/start/, (msg) => {
            try {
                if(Number(msg.chat.id) === Number(this.chatID)){
                    this.buttonMenu();
                }
                else{
                    this.enqueueMessage(msg.chat.id, 'Вы не являетесь владельцем данного сервиса!!!');
                };
            } 
            catch (error) {
                console.log("Startup error:", error);
                this.enqueueMessage(this.chatID, "Ошибка сервера при запуске бота 🤖!!!")
            }
        });

        this.bot.onText(/\/get_senders|Получить список отправителей/i, async () => {
            try {
                const senders = await this.prisma.messagesIP.findMany({
                    select: {
                        id: true,
                        name: true,
                        contacts: true
                    }
                });

                if (senders.length === 0) {
                    this.enqueueMessage(this.chatID, '🤔 Отправителей не найдено!!!\n 🤷‍♂️ Пока никто не отправлял сообщения.');
                    return;
                };

                let res = `✨ Список всех отправителей за все время ✨\n===========================\n`;
                senders.forEach((sender) => {
                    res += `👤 Идентификатор: ${sender.id}\n`;
                    res += `➡️ Отправитель: ${sender.name}\n`;
                    res += `📞 Контакты: ${sender.contacts}\n===========================\n`;
                });

                let keyboard: keyboardType[][] = [];
                senders.forEach((sender) => {
                    keyboard.push([{
                        text: `👤 ${sender.name} (ID: ${sender.id})`,
                        callback_data: `get_sender_data:${sender.id}`
                    }]);
                });

                let options = {
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                };

                const messageParts = this.splitMessage(res);

                for (let i = 0; i < messageParts.length; i++) {
                    const part = messageParts[i];
                    if (i === messageParts.length - 1) {
                        this.enqueueMessage(this.chatID, part, options);
                    }
                    else {
                        this.enqueueMessage(this.chatID, part);
                    };
                };
            }
            catch (error) {
                console.log("Server error when trying to get a list of all senders:", error);
                this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nОшибка сервера при попытке получить список всех отправителей!!!\nПопробуйте позже.");
            };
        });

        this.bot.onText(/\/clear_records_db|Очистить базу данных/i, async () => {
            try {
                let res = `🚨 Внимание! 🚨\nВы уверены, что хотите удалить данные обо ВСЕХ пользователях?\nЭто действие приведет к ПОЛНОЙ очистке базы данных!`;

                const messageID: null | number = await this.enqueueMessage(this.chatID, res);

                let keyboard: keyboardType[][] = [];

                if (messageID) {
                    keyboard.push([
                        {
                            text: "Да ✅",
                            callback_data: `confirm_clear_records_db/${messageID}`
                        },
                        {
                            text: "Нет ❌",
                            callback_data: `cancel_clear_records_db/${messageID}`
                        }
                    ]);

                    const options = {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    };

                    await this.editMessage(this.chatID, messageID, res, options);
                }
                else {
                    await this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nПроизошла непредвиденная ошибка!!!\n😱 Пожалуйста, попробуйте снова выполнить команду • /clear_records_db.")
                };
            }
            catch (error) {
                console.log("Error when trying to clear the database:", error);
                this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nОшибка при попытке очистить базу данных!!!\nПопробуйте позже.");
            };
        })

        this.bot.on("callback_query", async (callbackQuery) => {
            const { data } = callbackQuery;

            if (data?.startsWith("get_sender_data:")) {
                const senderID = parseInt(data.split(':')[1]);
                if (isNaN(senderID)) {
                    this.enqueueMessage(this.chatID, "⛔️ Ошибка! ⛔️\nНеверный ID отправителя!!!\nПроверьте правильность введенного ID.");
                    return;
                };

                try {
                    const sender = await this.prisma.messagesIP.findUnique({
                        where: { id: senderID },
                        include: { messages: true }
                    });

                    if (!sender) {
                        this.enqueueMessage(this.chatID, "🔍 Отправитель с таким ID не найден!!!\n🧐 Возможно, он был удален или не существует.");
                        return;
                    };

                    let res = `ℹ️ Подробная информация об отправителе ${sender.name} (ID: ${sender.id})\n------------------------------------------\n`;
                    res += `👤 Имя: ${sender.name}\n------------------------------------------\n`;
                    res += `📞 Контакты: ${sender.contacts}\n------------------------------------------\n`;
                    res += `💬 Сообщения:\n`;

                    if (sender.messages && sender.messages.length > 0) {
                        sender.messages.forEach((msg) => {
                            res += `— ➡️ ${msg.message}\n`;
                        });
                    }
                    else {
                        res += `Сообщений не найдено!!!`;
                    };

                    const keyboard: keyboardType[][] = [];

                    keyboard.push([{
                        text: `Удалить отправителя 🚯`,
                        callback_data: `delete_current_sender:${sender.id}`
                    }])

                    const options = {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    };

                    const messageParts = this.splitMessage(res);

                    for (let i = 0; i < messageParts.length; i++) {
                        let part = messageParts[i];
                        if (i === messageParts.length - 1) {
                            this.enqueueMessage(this.chatID, part, options);
                        }
                        else {
                            this.enqueueMessage(this.chatID, part);
                        }
                    };
                }
                catch (error) {
                    console.log("Server error when trying to receive all sender's data:", error);
                    this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nОшибка сервера при попытке получить все данные об отправителе!!!\nПопробуйте позже.");
                };
            };

            if (data?.startsWith('delete_current_sender:')) {
                const senderID = parseInt(data.split(':')[1]);

                if (isNaN(senderID)) {
                    this.enqueueMessage(this.chatID, '⛔️ Ошибка! ⛔️\nНеверный ID отправителя!!!\nПроверьте правильность введенного ID.');
                    return;
                };

                try {
                    const sender = await this.prisma.messagesIP.findUnique({
                        where: { id: senderID }
                    });

                    if (!sender) {
                        this.enqueueMessage(this.chatID, '🔍 Отправитель с таким ID не найден!!!\n🧐 Возможно, он был удален или не существует.');
                        return;
                    };

                    let res = `⚠️ Внимание! ⚠️\nВы действительно хотите удалить запись об отправителе ${sender.name} (ID: ${sender.id})?\nЭто действие необратимо!`;

                    let keyboard: keyboardType[][] = [];

                    let messageID: number | null = await this.enqueueMessage(this.chatID, res);


                    if (messageID) {
                        keyboard.push([
                            {
                                text: "Да ✅",
                                callback_data: `confirm_delete_current_sender:${sender.id}/${messageID}`
                            },
                            {
                                text: "Нет ❌",
                                callback_data: `cancel_delete_current_sender/${messageID}`
                            }
                        ]);

                        const options = {
                            reply_markup: {
                                inline_keyboard: keyboard
                            }
                        };

                        await this.editMessage(this.chatID, messageID, res, options);
                    }
                    else {
                        await this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nПроизошла непредвиденная ошибка!!!\n😱 Пожалуйста, попробуйте снова нажать кнопку «Удалить пользователя 🚯»");
                    };
                }
                catch (error) {
                    console.log("Server error when trying to delete sender data:", error);
                    this.enqueueMessage(this.chatID, "❌ Ошибка! ❌\nОшибка сервера при попытке удаления данных об отправителе!!!\nПопробуйте позже.");
                }
            };

            if (data?.startsWith('confirm_delete_current_sender:')) {
                const senderID = parseInt(data.split(':')[1]);
                const messageID = parseInt(data.split('/')[1]);

                if (isNaN(senderID)) {
                    this.enqueueMessage(this.chatID, '⛔️ Ошибка! ⛔️\nНеверный ID отправителя!!!\nПроверьте правильность введенного ID.');
                    return;
                };

                try {
                    const sender = await this.prisma.messagesIP.findUnique({
                        where: { id: senderID }
                    });

                    if (!sender) {
                        this.enqueueMessage(this.chatID, '🔍 Отправитель с таким ID не найден!!!\n🧐 Возможно, он был удален или не существует.');
                        return;
                    };

                    try {
                        if (messageID) {
                            await this.prisma.messagesIP.delete({
                                where: { id: sender.id },
                                include: { messages: true }
                            });

                            let res = `✅ Запись об отправителе ${sender.name} (ID: ${sender.id}) успешно удалена! 👌🗑️`;
                            await this.editMessage(this.chatID, messageID, res);
                        }
                        else {
                            await this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nПроизошла непредвиденная ошибка!!!\n😱 Пожалуйста, попробуйте снова нажать кнопку «Удалить пользователя 🚯»");
                        };
                    }
                    catch (error) {
                        console.log("Error deleting sender:", error);
                        this.enqueueMessage(this.chatID, '⚠️ Ошибка! ⚠️\nОшибка удаления записи об отправителе!!!\nПопробуйте еще раз.');
                    };
                }
                catch (error) {
                    console.log("Server error when confirming the deletion of the sender record:", error);
                    this.enqueueMessage(this.chatID, '❌ Ошибка! ❌\nОшибка сервера при подтверждении удаления записи об отправителе!!!\nПопробуйте позже.');
                };
            };

            if (data?.startsWith('cancel_delete_current_sender')) {
                const messageID = parseInt(data.split('/')[1]);

                if (messageID) {
                    let res = `❌ Удаление данных об отправителе отменено 🙅‍♂️.\nЗапись сохранена!`;
                    await this.editMessage(this.chatID, messageID, res);
                }
                else {
                    await this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nПроизошла непредвиденная ошибка!\n😱 Пожалуйста, попробуйте снова нажать кнопку «Удалить пользователя 🚯»");
                };
            };

            if (data?.startsWith("confirm_clear_records_db")) {
                const messageID = parseInt(data.split('/')[1]);

                try {
                    if (messageID) {
                        let res = `✅ База данных очищена! 👌🗑️\nИнформации об отправителях больше нет! Начнем с чистого листа! 📝`;
                        await this.prisma.messagesIP.deleteMany({});
                        await this.editMessage(this.chatID, messageID, res);
                    }
                    else {
                        await this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nПроизошла непредвиденная ошибка!!!\n😱 Пожалуйста, попробуйте снова выполнить команду • /clear_records_db.");
                    };
                }
                catch (error) {
                    console.log("Error when clearing the database:", error);
                    this.enqueueMessage(this.chatID, '❌ Ошибка! ❌\nОшибка при попытке очистить базу данных!!!\nПопробуйте позже.');
                };
            };

            if (data?.startsWith("cancel_clear_records_db")) {
                const messageID = parseInt(data.split('/')[1]);

                if (messageID) {
                    let res = `❌ Очистка базы данных отменена 🙅‍♂️.\nДанные сохранены!`;
                    await this.editMessage(this.chatID, messageID, res);
                }
                else {
                    await this.enqueueMessage(this.chatID, "⚠️ Ошибка! ⚠️\nПроизошла непредвиденная ошибка!!!\n😱 Пожалуйста, попробуйте снова выполнить команду • /clear_records_db.");
                };
            };
        });

        this.bot.on("polling_error", (error) => {
            console.log(error);
            this.enqueueMessage(this.chatID, "Ошибка сервера!!!");
        });
    };
};