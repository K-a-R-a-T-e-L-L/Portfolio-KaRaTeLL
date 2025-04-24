import { IsBoolean, IsString } from "class-validator";

export class CreateSkillDto {
    @IsString()
    value: string;

    @IsBoolean()
    active: boolean;
}