import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BotService } from 'src/bot/bot.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    private readonly chatID: number;
    constructor(private prisma: PrismaService, private botServise: BotService) {
        this.chatID = parseInt(process.env.CHAT_ID as string) as number;
    }

    async messageSend(ip: string, name: string, contacts: string, message: string) {

        let text = `🚨 Новое сообщение от Portfolio KaRaTeLL 🚨\n------------------------------------------\n`;
        text += `👤 Имя: ${name}\n------------------------------------------\n`;
        text += `📞 Контакты: ${contacts}\n------------------------------------------\n`;
        text += `💬 Сообщение: ${message}`;

        try {
            const messagesIp = await this.prisma.messagesIP.findUnique({
                where: { ip }
            });
            if (messagesIp) {
                const lastMessageDate = new Date(messagesIp.date).getTime();
                const newDate = Date.now();
                const day = 100;
                // 24 * 60 * 60 * 1000
                if (messagesIp.ip === ip && (newDate - lastMessageDate) < day) {
                    console.log("Messages can be sent no more than 24 hours later!!!");
                    throw new ConflictException("Messages can be sent no more than 24 hours later!!!");
                }
                else {
                    try {
                        await this.prisma.messagesIP.update({
                            where: { ip: ip },
                            data: {
                                name: name,
                                contacts: contacts,
                                date: new Date().toISOString(),
                                messages: {
                                    create: { message: message }
                                }
                            }
                        });
                        await this.botServise.enqueueMessage(this.chatID, text);
                    } catch (error) {
                        console.error("Error updating message:", error);
                        throw new InternalServerErrorException("Failed to update message!!!");
                    }
                };
            }
            else {
                try {
                    await this.prisma.messagesIP.create({
                        data: {
                            ip,
                            name,
                            contacts,
                            date: new Date().toISOString(),
                            messages: {
                                create: { message: message }
                            }
                        }
                    });
                    await this.botServise.enqueueMessage(this.chatID, text);
                } catch (error) {
                    console.error("Error creating message:", error);
                    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                        throw new ConflictException('IP address already exists!!!');
                    }
                    throw new InternalServerErrorException("Failed to create message!!!");
                }
            }
            return { message: "Message processed successfully" };
        }
        catch (error) {
            if (error instanceof ConflictException || error instanceof InternalServerErrorException) {
                throw error;
            }
            console.error("Server error:", error);
            throw new InternalServerErrorException('Server error!!!');
        }
    }
}
