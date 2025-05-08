import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { MessageModule } from './message/message.module';
import { BotModule } from './bot/bot.module';
import { UpModule } from './up/up.module';

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    SkillsModule,
    MessageModule,
    BotModule,
    UpModule,
  ],
  providers: [PrismaService],
})

export class AppModule { }