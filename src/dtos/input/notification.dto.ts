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
    title: z.string().min(1, "Title cannot be empty"),
    message: z.string().min(1, "Message cannot be empty"),
    type: z.enum(["push", "email", "sms"]).default("push"),
});



export const GetUserNotificationsDTO = z.object({
    userId: z.coerce.number().int().positive(),
});

export type GetUserNotificationsDTOType = z.infer<typeof GetUserNotificationsDTO>;
