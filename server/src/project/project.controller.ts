import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './create-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {  };

  @Post('addingProject')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'img', maxCount: 10 },
    { name: 'icon', maxCount: 3 }
  ], multerConfig))

  async addingProject(@UploadedFiles() files: { img?: Express.Multer.File[], icon?: Express.Multer.File[] }, @Body() createProjectDto: CreateProjectDto) {    
    return this.projectService.addingProject({
      ...createProjectDto,
      positioningIcon: JSON.parse(createProjectDto.positioningIcon),
      skills: JSON.parse(createProjectDto.skills),
      view: JSON.parse(createProjectDto.view),
      images: files
    });
  };

  @Get('getProjects')
  async getProjects() {
    return this.projectService.getProjects();
  };

  @Get('getProject/:id')
  async getProject(@Param("id") id: string) {
    return this.projectService.getProject(Number(id));
  };

  @Delete('deleteProject/:id')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteProject(@Param("id") id: string) {
    return this.projectService.deleteProject(Number(id))
  };
};