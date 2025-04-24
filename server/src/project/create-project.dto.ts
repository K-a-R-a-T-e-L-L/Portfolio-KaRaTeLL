import { IsArray, IsJSON, IsString, ValidateNested } from "class-validator";

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsString()
    link: string;

    @IsString()
    description: string;

    // @IsArray()
    // // @ValidateNested({each: false})
    // positioningIcon: {
    //     x: number,
    //     y: number
    // }[];
    @IsJSON()
    positioningIcon: string;

    @IsString()
    color: string;

    // @IsArray()
    // // @ValidateNested({each: false})
    // skills: string[];
    @IsJSON()
    skills: string;
    
    images: {
        img?: Express.Multer.File[] | undefined,
        icon?: Express.Multer.File[] | undefined
    };

    // @IsArray()
    // // @ValidateNested({each: false})
    // view: boolean[];
    @IsJSON()
    view: string;
};