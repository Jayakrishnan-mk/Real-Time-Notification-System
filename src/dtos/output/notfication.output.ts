import { IsArray } from "class-validator";
import { BaseStatus } from "./baseStatus.dto";
import { notifications } from "@prisma/client";
import { user_notifications_status } from "@prisma/client";

export class GetAllNotificationsDTO extends BaseStatus {
    @IsArray()
    notificationsList!: notifications[];
}


export class GetUserNotificationsOutputDTO {
    status!: boolean;
    message!: string;
    notificationsList!: {
        id: number;
        message: string;
        type: string;
        is_read: boolean;
        read_at: Date | null;
        status: user_notifications_status;
        created_at: Date;
    }[];
}