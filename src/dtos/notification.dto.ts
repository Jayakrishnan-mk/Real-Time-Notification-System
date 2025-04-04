import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseStatus } from "./baseStatus.dto";
import { notifications } from "@prisma/client";

export class CreateNotificationDTO {
    @IsNotEmpty()
    @IsNumber()
    userId!: number;

    @IsNotEmpty()
    @IsString()
    message!: string;
}

export class GetAllNotificationsDTO extends BaseStatus {
    @IsArray()
    notificationsList!: notifications[];
}
