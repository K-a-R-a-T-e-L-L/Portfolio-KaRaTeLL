import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async addingProject(data) {
        const { name, link, description, positioningIcon, color, skills, images, view } = data;

        if (!images.icon || images.icon.length < 1 || images.icon.length > 3) {
            throw new ConflictException('Add from 1 to 3 icons!!!');
        }
        else if (!images.img || images.img.length < 1 || images.img.length > 10) {
            throw new ConflictException('Add from 1 to 10 images!!!');
        }
        else if (skills.length < 3 || skills.length > 20) {
            throw new BadRequestException('Add from 3 to 20 skills!!!');
        };

        const ImagesPaths = {
            img: images.img?.map((file) => file.filename) || [],
            icon: images.icon?.map((file) => file.filename) || []
        };

        try {
            return await this.prisma.projects.create({
                data: {
                    name: name,
                    link: link,
                    description: description,
                    positioningIcon: JSON.stringify(positioningIcon),
                    color: color,
                    skills: skills,
                    URLImages: JSON.stringify(ImagesPaths),
                    view: view,
                }
            });
        }
        catch (error) {
            console.error(error);
            if (images.img) {
                images.img.forEach(file => unlinkSync(file.path));
            }
            if (images.icon) {
                images.icon.forEach(file => unlinkSync(file.path));
            }
            throw new InternalServerErrorException('Bad connection or server error when receiving projects!!!');
        }
    };


    async getProjects() {
        try {
            const projects = await this.prisma.projects.findMany();
            return projects.map((project) => ({
                ...project,
                URLImages: JSON.parse(project.URLImages as string),
                positioningIcon: JSON.parse(project.positioningIcon as string)
            }));
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Server error when getting a projects!!!');
        }
    }

    async getProject(id: number) {
        try {
            let project = await this.prisma.projects.findUnique({
                where: { id: id },
            });
            if (!project) throw new NotFoundException(`Project with ID ${id} not found!!!`);
            return {
                ...project,
                URLImages: JSON.parse(project?.URLImages as string),
                positioningIcon: JSON.parse(project?.positioningIcon as string)
            }
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Bad connection or server error when receiving the project!!!');
        }
    }

    async deleteProject(id: number) {
        try {
            const project = await this.prisma.projects.findUnique({
                where: { id: id }
            });

            if (!project) throw new NotFoundException(`Project with ID ${id} not found!!!`);

            const { URLImages } = project;
            const Images = JSON.parse(URLImages as string);

            if (Images.img) {
                Images.img.forEach(fileName => {
                    unlinkSync(join(process.cwd(), 'uploads', fileName));
                })
            };

            if (Images.icon) {
                Images.icon.forEach(fileName => {
                    unlinkSync(join(process.cwd(), 'uploads', fileName));
                })
            };

            await this.prisma.projects.delete({
                where: { id: id }
            });

            return { message: 'Project deleted successfully' };

        } catch (error) {
            console.error(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Bad connection or server error when deleting a project!!!');
        }
    }
}
