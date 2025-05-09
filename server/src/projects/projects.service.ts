import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { unlinkSync, promises as fs } from 'fs';
import { join } from 'path';

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
            throw new InternalServerErrorException('Bad connection or server error when adding projects!!!');
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

    async editProject(data) {
        const { name, link, description, positioningIcon, color, skills, images, view, id } = data;

        if (skills.length < 3 || skills.length > 20) {
            throw new BadRequestException('Add from 3 to 20 skills!!!');
        };

        const project = await this.prisma.projects.findUnique({
            where: { id: id }
        });

        if (!project) throw new NotFoundException('Project not found!!!');

        const ImagesPaths = () => {
            if (images) {
                return {
                    img: images.img?.map((file) => file.filename) || [],
                    icon: images.icon?.map((file) => file.filename) || []
                }
            } else return null;
        };

        const newURLImagesProject = async () => {
            const paths = ImagesPaths();
            const URLImages = JSON.parse(project.URLImages as string);

            if (paths !== null) {
                if (paths.img.length > 0 && paths.icon.length > 0) {
                    await this.deleteFilesSafely(URLImages);
                    return paths;
                }
                else if (paths.img.length > 0 && paths.icon.length === 0) {
                    await this.deleteFilesSafely({ img: URLImages.img, icon: [] });
                    return { img: paths.img, icon: URLImages.icon };
                }
                else if (paths.img.length === 0 && paths.icon.length > 0) {
                    await this.deleteFilesSafely({ img: [], icon: URLImages.icon });
                    return { img: URLImages.img, icon: paths.icon };
                }
                else { return URLImages; };
            }
            else { return URLImages; };
        };

        const URLImagesProject = await newURLImagesProject();

        const newView = view.map((el) => {
            if (el === null) { return false }
            else { return true };
        });

        try {
            return await this.prisma.projects.update({
                where: { id: project.id },
                data: {
                    name: name,
                    link: link,
                    description: description,
                    positioningIcon: JSON.stringify(positioningIcon),
                    color: color,
                    view: newView,
                    URLImages: JSON.stringify(URLImagesProject),
                    skills: skills
                }
            })
        } catch (error) {
            console.error(error);
            if (images.img) {
                images.img.forEach(file => unlinkSync(file.path));
            }
            if (images.icon) {
                images.icon.forEach(file => unlinkSync(file.path));
            }
            throw new InternalServerErrorException('Bad connection or server error when updating projects!!!');
        }
    }
}
