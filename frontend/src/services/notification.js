import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Configure how notifications appear
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function setupNotifications() {
    if (!Device.isDevice) return; // notifications won't work on simulator reliably

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
}

// schedule a reminder
export async function scheduleHarvestReminder(hiveId, title, date) {
    if (!date) return null;

    // cancel previous same-id schedules if you want (not implemented fully)
    const triggerDate = new Date(date);

    if (triggerDate <= new Date()) return null;

    return Notifications.scheduleNotificationAsync({
        content: {
            title: "Honey Harvest Reminder 🍯",
            body: `${title} is nearing harvest date.`,
            data: { hiveId },
        },
        trigger: triggerDate,
    });
}
