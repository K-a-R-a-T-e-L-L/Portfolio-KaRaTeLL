import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, RolesGuard],
})
export class ProjectModule {}