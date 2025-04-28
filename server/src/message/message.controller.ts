import { Body, Controller, Logger, Post, Req, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './create-message.dto';

@Controller('message')
export class MessageController {
  private readonly logger = new Logger(MessageController.name);
  constructor(private readonly messageService: MessageService) { }

  @Post('send')
  @UsePipes(new ValidationPipe())
  async messageSend(@Body() createMessageDTO: CreateMessageDTO, @Req() req: Request ) {

    const BearerToken = req.headers.authorization?.split(' ')[1];
    if(!BearerToken) throw new UnauthorizedException('Invalid token');
    
    return this.messageService.messageSend(createMessageDTO.name, createMessageDTO.contacts, createMessageDTO.message, BearerToken);
  }
}
