import { Alert, Linking, NativeModules, Platform } from "react-native";

const nativeAlarms = NativeModules.ReminderAlarms;

export function isXiaomiDevice() {
  const constants = Platform.constants || {};
  const brand = String(constants.Brand || constants.Manufacturer || "").toLowerCase();
  return /xiaomi|redmi|poco|blackshark/.test(brand);
}

export async function getBackgroundDeliveryStatus() {
  if (Platform.OS !== "android" || !nativeAlarms) {
    return {
      exactAlarms: true,
      batteryUnrestricted: true,
      nativeAvailable: Boolean(nativeAlarms),
    };
  }

  const [exactAlarms, batteryUnrestricted] = await Promise.all([
    nativeAlarms.canScheduleExactAlarms(),
    nativeAlarms.isIgnoringBatteryOptimizations(),
  ]);

  return {
    exactAlarms: Boolean(exactAlarms),
    batteryUnrestricted: Boolean(batteryUnrestricted),
    nativeAvailable: true,
  };
}

export async function openExactAlarmSettings() {
  if (Platform.OS !== "android") {
    return false;
  }
  if (nativeAlarms?.openExactAlarmSettings) {
    await nativeAlarms.openExactAlarmSettings();
    return true;
  }
  await Linking.openSettings();
  return true;
}

export async function requestUnrestrictedBattery() {
  if (Platform.OS !== "android") {
    return false;
  }
  if (nativeAlarms?.requestIgnoreBatteryOptimizations) {
    await nativeAlarms.requestIgnoreBatteryOptimizations();
    return true;
  }
  await Linking.openSettings();
  return true;
}

export async function openAppNotificationSettings() {
  if (nativeAlarms?.openAppSettings) {
    await nativeAlarms.openAppSettings();
    return;
  }
  await Linking.openSettings();
}

export async function ensureBackgroundDelivery({ prompt = true } = {}) {
  if (Platform.OS !== "android") {
    return { ready: true };
  }

  const status = await getBackgroundDeliveryStatus();
  if (status.exactAlarms && status.batteryUnrestricted) {
    return { ready: true, status };
  }

  if (!prompt) {
    return { ready: false, status };
  }

  if (!status.exactAlarms) {
    await new Promise((resolve) => {
      Alert.alert(
        "Alarmas exactas",
        "Android está retrasando los avisos. Activa alarmas y recordatorios para iCitas; si no, la notificación puede llegar tarde o solo al abrir la app.",
        [
          { text: "Ahora no", style: "cancel", onPress: resolve },
          {
            text: "Activar",
            onPress: async () => {
              await openExactAlarmSettings();
              resolve();
            },
          },
        ]
      );
    });
  }

  const afterAlarms = await getBackgroundDeliveryStatus();
  if (!afterAlarms.batteryUnrestricted) {
    await new Promise((resolve) => {
      Alert.alert(
        "Batería sin restricciones",
        "Xiaomi y Android cierran las apps en segundo plano. Quita la optimización de batería de iCitas para que el aviso salga a la hora, aunque la app esté cerrada.",
        [
          { text: "Ahora no", style: "cancel", onPress: resolve },
          {
            text: "Permitir",
            onPress: async () => {
              await requestUnrestrictedBattery();
              resolve();
            },
          },
        ]
      );
    });
  }

  const finalStatus = await getBackgroundDeliveryStatus();
  if (isXiaomiDevice()) {
    Alert.alert(
      "Xiaomi / HyperOS",
      "En Ajustes de iCitas activa también Inicio automático y deja la batería en Sin restricciones. Si no, el teléfono puede silenciar las citas.",
      [{ text: "Entendido" }]
    );
  }

  return {
    ready: finalStatus.exactAlarms && finalStatus.batteryUnrestricted,
    status: finalStatus,
  };
}
