import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillsDto } from './create-skills.dto';

@Injectable()
export class SkillsService {
    constructor(private prisma: PrismaService) { }

    async addingSkill(createSkillsDto: CreateSkillsDto) {
        const { value, active } = createSkillsDto;
        if (!value) throw new ConflictException("Enter the correct information!!!")
        try {
            return await this.prisma.skills.create({
                data: {
                    value,
                    active
                }
            });
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Bad connection or server error when adding a skill!!!');
        }
    }

    async getSkills() {
        try {
            const skills = await this.prisma.skills.findMany();
            return skills;
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Bad connection or server error when getting skills!!!');
        }
    }

    async updateActive(id) {
        try {
            const skill = await this.prisma.skills.findUnique({
                where: { id }
            });

            if (!skill) throw new NotFoundException(`When trying to upgrade, the skill with the ${id} was not found!!!`);

            await this.prisma.skills.update({
                where: {id},
                data: {
                    active: !skill.active
                }
            });

            return await this.prisma.skills.findUnique({
                where: { id }
            });
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Bad connection or server error when updating the skill!!!')
        }
    }

    async deleteSkill(id) {
        try {
            const skill = await this.prisma.skills.findUnique({
                where: { id }
            });

            if (!skill) throw new NotFoundException(`The skill with the ID ${id} was not found when trying to delete it!!!`);

            await this.prisma.skills.delete({
                where: { id }
            });

            return { message: 'Skill deleted successfully' };
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('A bad connection or server error when deleting a skill!!!')
        }
    }
}
