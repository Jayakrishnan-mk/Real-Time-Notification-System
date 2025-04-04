import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class BaseStatus {
    @IsNotEmpty()
    @IsBoolean()
    status!: boolean;

    @IsNotEmpty()
    @IsString()
    message!: string;
}
