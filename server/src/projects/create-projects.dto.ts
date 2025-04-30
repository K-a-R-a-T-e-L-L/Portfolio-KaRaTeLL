import { IsJSON, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProjectsDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    link: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(50)
    @MaxLength(1000)
    description: string;

    @IsJSON()
    positioningIcon: string;

    @IsString()
    color: string;

    @IsJSON()
    skills: string;
    
    images: {
        img?: Express.Multer.File[],
        icon?: Express.Multer.File[]
    };

    @IsJSON()
    view: string;
};