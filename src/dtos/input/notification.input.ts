import { IsNumber } from "class-validator";
import { z } from "zod";


export class MarkNotificationAsReadDTO {
    @IsNumber()
    user_id!: number;

    @IsNumber()
    notification_id!: number;
}

export const DeleteNotificationDTO = z.object({
    id: z.number(),
});


export const CreateNotificationDTO = z.object({
    userId: z.number(),
    message: z.string().min(1, "Message cannot be empty"),
});


export const GetUserNotificationsDTO = z.object({
    userId: z.coerce.number().int().positive(),
});

export type GetUserNotificationsDTOType = z.infer<typeof GetUserNotificationsDTO>;
