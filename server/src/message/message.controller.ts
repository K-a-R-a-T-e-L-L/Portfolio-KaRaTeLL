import { Body, Controller, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('send')
  @UsePipes(new ValidationPipe())
  async messageSend(@Body() createMessageDTO: CreateMessageDTO, @Req() req: Request) {
    const ip = req.ip
      || (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.connection?.remoteAddress
      || 'unknown';
    return this.messageService.messageSend(ip, createMessageDTO.name, createMessageDTO.contacts, createMessageDTO.message);
  }
}
