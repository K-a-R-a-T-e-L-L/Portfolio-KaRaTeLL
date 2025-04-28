import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, RolesGuard],
})
export class ProjectsModule {}