import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './create-skill.dto';

@Injectable()
export class SkillService {
    constructor(private prisma: PrismaService) { }

    async addingSkill(createSkillDto: CreateSkillDto) {
        const { value, active } = createSkillDto;
        if (!value) throw new ConflictException("Enter the correct information!!!")
        try {
            return await this.prisma.skill.create({
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
            const skills = await this.prisma.skill.findMany();
            return skills;
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Bad connection or server error when getting skills!!!');
        }
    }

    async updateActive(id) {
        try {
            const skill = await this.prisma.skill.findUnique({
                where: { id }
            });

            if (!skill) throw new NotFoundException(`When trying to upgrade, the skill with the ${id} was not found!!!`);

            await this.prisma.skill.update({
                where: {id},
                data: {
                    active: !skill.active
                }
            });

            return await this.prisma.skill.findUnique({
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
            const skill = await this.prisma.skill.findUnique({
                where: { id }
            });

            if (!skill) throw new NotFoundException(`The skill with the ID ${id} was not found when trying to delete it!!!`);

            await this.prisma.skill.delete({
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
