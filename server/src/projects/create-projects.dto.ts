import { IsJSON, IsString } from "class-validator";

export class CreateProjectsDto {
    @IsString()
    name: string;

    @IsString()
    link: string;

    @IsString()
    description: string;

    @IsJSON()
    positioningIcon: string;

    @IsString()
    color: string;

    @IsJSON()
    skills: string;
    
    images: {
        img?: Express.Multer.File[] | undefined,
        icon?: Express.Multer.File[] | undefined
    };

    @IsJSON()
    view: string;
};