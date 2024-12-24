import * as Haptics from "expo-haptics";

export function lightHaptics() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
export function mediumHaptics() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
export function successHaptics() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
