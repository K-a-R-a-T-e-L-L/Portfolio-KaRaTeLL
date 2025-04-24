import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateSkillDto } from './create-skill.dto';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('addingSkill')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async addingSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.addingSkill(createSkillDto);
  }

  @Get('getSkills')
  async getSkills() {
    return this.skillService.getSkills();
  }

  @Put('updateActive/:id')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateActive(@Param('id') id: string) {
    return this.skillService.updateActive(Number(id));
  }

  @Delete('deleteSkill/:id')
  @Roles(process.env.ADMIN_ROLE as string)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteSkill(@Param('id') id: string) {
    return this.skillService.deleteSkill(Number(id));
  }
}
