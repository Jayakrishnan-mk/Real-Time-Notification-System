
export type NotificationJobData = {
    userId: number;
    title: string;
    message: string;
    type: "push" | "email" | "sms";
};

