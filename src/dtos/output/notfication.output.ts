import { IsArray } from "class-validator";
import { BaseStatus } from "./baseStatus.dto";
import { notifications } from "@prisma/client";

export class GetAllNotificationsDTO extends BaseStatus {
    @IsArray()
    notificationsList!: notifications[];
}