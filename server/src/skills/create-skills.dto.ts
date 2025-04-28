import { IsBoolean, IsString } from "class-validator";

export class CreateSkillsDto {
    @IsString()
    value: string;

    @IsBoolean()
    active: boolean;
}