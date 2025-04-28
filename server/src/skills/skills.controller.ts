import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateSkillsDto } from './create-skills.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post('addingSkill')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async addingSkill(@Body() createSkillsDto: CreateSkillsDto) {
    return this.skillsService.addingSkill(createSkillsDto);
  }

  @Get('getSkills')
  async getSkills() {
    return this.skillsService.getSkills();
  }

  @Put('updateActive/:id')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateActive(@Param('id') id: string) {
    return this.skillsService.updateActive(Number(id));
  }

  @Delete('deleteSkill/:id')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteSkill(@Param('id') id: string) {
    return this.skillsService.deleteSkill(Number(id));
  }
}
