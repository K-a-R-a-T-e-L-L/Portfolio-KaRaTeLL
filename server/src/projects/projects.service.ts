import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { unlinkSync, promises as fs } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import sharp from 'sharp';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async addingProject(data) {
        const { name, link, description, positioningIcon, color, skills, images, view } = data;

        if (!images.icon || images.icon.length < 1 || images.icon.length > 3) {
            throw new ConflictException('Add from 1 to 3 icons!!!');
        }
        else if (!images.img || images.img.length < 1 || images.img.length > 20) {
            throw new ConflictException('Add from 1 to 20 images!!!');
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

    private getMimeType(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'png':
                return 'image/png';
            case 'webp':
                return 'image/webp';
            case 'gif':
                return 'image/gif';
            default:
                return 'image/jpeg';
        }
    }

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
        let project;
        try {
            project = await this.prisma.$transaction(async (tx) => {
                const p = await tx.projects.findUnique({
                    where: { id },
                    select: { URLImages: true }
                });
                if (!p) throw new NotFoundException(`Project with ID ${id} not found!`);

                await tx.projects.delete({ where: { id } });
                return p;
            });

            if (project?.URLImages) {
                const Images = JSON.parse(project.URLImages as string);
                await this.deleteFilesSafely(Images);
            }

            return { message: 'Project deleted successfully' };
        } catch (error) {
            console.error('Delete project error:', error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error deleting project');
        }
    }

    private async deleteFilesSafely(Images: { img?: string[]; icon?: string[] }) {
        try {
            const deletePromises: Promise<void>[] = [];

            if (Images.img?.length) {
                deletePromises.push(...Images.img.map(fileName =>
                    fs.unlink(join(process.cwd(), 'uploads', fileName)).catch(() => { })
                ));
            }

            if (Images.icon?.length) {
                deletePromises.push(...Images.icon.map(fileName =>
                    fs.unlink(join(process.cwd(), 'uploads', fileName)).catch(() => { })
                ));
            }

            await Promise.all(deletePromises);
        } catch (err) {
            console.error('File deletion error:', err);
        }
    }
}
