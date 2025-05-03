import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { MessageModule } from './message/message.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    SkillsModule,
    // MessageModule,
    // BotModule,
  ],
  providers: [PrismaService],
})

export class AppModule { }