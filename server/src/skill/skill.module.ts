import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  controllers: [SkillController],
  providers: [SkillService, PrismaService, RolesGuard],
})
export class SkillModule {}
