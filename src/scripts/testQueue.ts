
import { notificationQueue } from "../queues/notificationQueue";

(async () => {
    await notificationQueue.add("sendNotification", {
        userId: 1,
        title: 'new',
        type: 'push',
        message: "🔥 Test notification from queue!",
    });

    console.log("📥 Job added to queue");
})();
