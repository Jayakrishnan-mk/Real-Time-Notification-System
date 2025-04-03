import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNotificationDTO {
    @IsNotEmpty()
    @IsNumber()
    userId!: number;

    @IsNotEmpty()
    @IsString()
    message!: string;
}
