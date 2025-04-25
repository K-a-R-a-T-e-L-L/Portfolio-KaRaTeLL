import { Body, Controller, Logger, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './create-message.dto';

@Controller('message')
export class MessageController {
  private readonly logger = new Logger(MessageController.name);
  constructor(private readonly messageService: MessageService) { }

  @Post('send')
  @UsePipes(new ValidationPipe())
  async messageSend(@Body() createMessageDTO: CreateMessageDTO, @Req() req: Request) {
    let ip = req.headers['x-forwarded-for'] as string;

    if (ip) {
      ip = ip.split(',')[0].trim();
    } else if (req.socket?.remoteAddress) {
      ip = req.socket.remoteAddress;
    } else if (req.ip) {
      ip = req.ip;
    } else {
      ip = 'unknown';
      this.logger.warn('Не удалось определить IP-адрес клиента.');
    }

    this.logger.debug(`Получен IP-адрес: ${ip}`);
    
    return this.messageService.messageSend(ip, createMessageDTO.name, createMessageDTO.contacts, createMessageDTO.message);
  }
}
