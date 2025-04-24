import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { SkillModule } from './skill/skill.module';
import { MessageModule } from './message/message.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [AuthModule,
    ProjectModule,
    SkillModule,
    MessageModule,
    BotModule,
  ],
  providers: [PrismaService],
})

export class AppModule { }
// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoginModule).forRoutes('login');
//   }
// }
