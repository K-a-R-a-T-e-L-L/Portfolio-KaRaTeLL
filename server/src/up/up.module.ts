import { Module } from '@nestjs/common';
import { UpService } from './up.service';
import { UpController } from './up.controller';

@Module({
  controllers: [UpController],
  providers: [UpService],
})
export class UpModule {}
