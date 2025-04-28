import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { BotService } from 'src/bot/bot.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    private readonly chatID: number;
    constructor(private prisma: PrismaService, private botServise: BotService, private jwtService: JwtService) {
        this.chatID = parseInt(process.env.CHAT_ID as string) as number;
    }

    async messageSend(name: string, contacts: string, message: string, token) {

        let tokenDecode: any = null;

        try {
            tokenDecode = this.jwtService.verify(token, { secret: process.env.SECRET_KEY_TOKEN_JWT });
        } catch (error) {
            console.log("Token decoding error:", error);
            throw new UnauthorizedException('Invalid token');
        };

        let text = `🚨 Новое сообщение от Portfolio KaRaTeLL 🚨\n------------------------------------------\n`;
        text += `👤 Имя: ${name}\n------------------------------------------\n`;
        text += `👤 Email: ${tokenDecode.email}\n------------------------------------------\n`;
        text += `👤 Номер телефона: ${tokenDecode.number}\n------------------------------------------\n`;
        text += `📞 Контакты: ${contacts}\n------------------------------------------\n`;
        text += `💬 Сообщение: ${message}`;

        try {
            const messagesCurrentUser = await this.prisma.userMessages.findFirst({
                where: {
                    OR: [
                        { email: tokenDecode.email },
                        { number: tokenDecode.number }
                    ]
                }
            });
            if (messagesCurrentUser) {
                const lastMessageDate = new Date(messagesCurrentUser.date).getTime();
                const newDate = Date.now();
                const day = 24 * 60 * 60 * 1000;
                if (messagesCurrentUser.email === tokenDecode.email && (newDate - lastMessageDate) < day) {
                    console.log("Messages can be sent no more than 24 hours later!!!");
                    throw new ConflictException("Messages can be sent no more than 24 hours later!!!");
                }
                else {
                    try {
                        await this.prisma.userMessages.update({
                            where: {
                                id: messagesCurrentUser.id
                            },
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
                    await this.prisma.userMessages.create({
                        data: {
                            email: tokenDecode.email,
                            number: tokenDecode.email,
                            name,
                            contacts,
                            date: new Date().toISOString(),
                            messages: {
                                create: { message: message }
                            }
                        }
                    });
                    await this.botServise.enqueueMessage(this.chatID, text);
                }
                catch (error) {
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
