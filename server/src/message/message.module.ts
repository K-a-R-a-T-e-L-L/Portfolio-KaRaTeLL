import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BotModule } from 'src/bot/bot.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [BotModule],
  controllers: [MessageController],
  providers: [MessageService, PrismaService, JwtService],
})
export class MessageModule {}
