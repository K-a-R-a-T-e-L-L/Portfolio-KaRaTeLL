import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAuthLoginDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    login: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    password: string;
}

export class CreateAuthRegisterDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    number: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(130)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    password: string;
}