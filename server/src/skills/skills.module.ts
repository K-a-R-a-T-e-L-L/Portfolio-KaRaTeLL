import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService, PrismaService, RolesGuard],
})
export class SkillsModule {}
