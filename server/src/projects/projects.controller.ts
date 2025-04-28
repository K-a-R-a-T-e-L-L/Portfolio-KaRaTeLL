import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateProjectsDto } from './create-projects.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {

  constructor(private readonly projectsService: ProjectsService) {  };

  @Post('addingProject')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'img', maxCount: 10 },
    { name: 'icon', maxCount: 3 }
  ], multerConfig))

  async addingProject(@UploadedFiles() files: { img?: Express.Multer.File[], icon?: Express.Multer.File[] }, @Body() createProjectsDto: CreateProjectsDto) {    
    
    return this.projectsService.addingProject({
      ...createProjectsDto,
      positioningIcon: JSON.parse(createProjectsDto.positioningIcon),
      skills: JSON.parse(createProjectsDto.skills),
      view: JSON.parse(createProjectsDto.view),
      images: files
    });
  };

  @Get('getProjects')
  async getProjects() {
    return this.projectsService.getProjects();
  };

  @Get('getProject/:id')
  async getProject(@Param("id") id: string) {
    return this.projectsService.getProject(Number(id));
  };

  @Delete('deleteProject/:id')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteProject(@Param("id") id: string) {
    return this.projectsService.deleteProject(Number(id))
  };
};