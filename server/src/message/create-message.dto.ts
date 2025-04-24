import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMessageDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(150)
    contacts: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(1000)
    message: string;
};