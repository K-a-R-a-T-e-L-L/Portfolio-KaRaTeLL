import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateProjectsDto } from './create-projects.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ProjectsService } from './projects.service';
import { join } from 'path';
import { existsSync } from 'fs';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {

  constructor(private readonly projectsService: ProjectsService) { };

  @Get('uploads/:filename')
  async getImage(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    const filePath = join(process.cwd(), 'uploads', filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    res.set({
      'Content-Type': this.getMimeType(filename),
      'Cache-Control': 'public, max-age=31536000, immutable'
    });

    return res.sendFile(filePath);
  }

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop();
    if(!ext) throw new BadRequestException();
    const Ext = ext.toLowerCase();
    switch (Ext) {
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
      case 'gif': return 'image/gif';
      default: return 'image/jpeg';
    }
  }

  @Post('addingProject')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'img', maxCount: 20 },
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