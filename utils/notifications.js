import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import moment from "moment";
import "moment/locale/es";

import {
  getAppointments,
  getCollectionWithId,
  getCurrentUser,
  updateDocument,
} from "./actions";
import { ensureBackgroundDelivery } from "./reminderAlarms";

moment.locale("es");

const CHANNEL_ID = "citas";
const NOTIFICATION_PREFIX = "cita-";

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: false,
  advanceAmount: 30,
  advanceUnit: "minutes",
};

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  // Sin módulo nativo (p. ej. aún no se recompiló la app) no debe tumbar el arranque.
}

function toJsDate(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value.toDate === "function") {
    return value.toDate();
  }
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeNotificationSettings(raw) {
  const amount = parseInt(raw?.advanceAmount, 10);
  const unit =
    raw?.advanceUnit === "hours" || raw?.advanceUnit === "minutes"
      ? raw.advanceUnit
      : DEFAULT_NOTIFICATION_SETTINGS.advanceUnit;

  return {
    enabled: Boolean(raw?.enabled),
    advanceAmount:
      Number.isFinite(amount) && amount > 0
        ? amount
        : DEFAULT_NOTIFICATION_SETTINGS.advanceAmount,
    advanceUnit: unit,
  };
}

export function advanceToMillis(amount, unit) {
  const safeAmount = Number(amount) || 0;
  if (unit === "hours") {
    return safeAmount * 60 * 60 * 1000;
  }
  return safeAmount * 60 * 1000;
}

export function formatAdvanceLabel(amount, unit) {
  const n = Number(amount) || 0;
  if (unit === "hours") {
    return n === 1 ? "1 hora" : `${n} horas`;
  }
  return n === 1 ? "1 minuto" : `${n} minutos`;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") {
    return;
  }
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Recordatorios de citas",
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    enableVibrate: true,
    bypassDnd: false,
    showBadge: true,
  });
}

export async function getNotificationPermission() {
  if (Platform.OS === "web") {
    return { granted: false };
  }
  const current = await Notifications.getPermissionsAsync();
  return {
    granted:
      current.granted === true ||
      current.status === "granted" ||
      current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL,
    canAskAgain: current.canAskAgain,
    status: current.status,
  };
}

export async function requestNotificationPermission() {
  if (Platform.OS === "web") {
    return { granted: false };
  }
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return { granted: true };
  }
  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
    android: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return {
    granted:
      requested.granted === true ||
      requested.status === "granted" ||
      requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL,
  };
}

export async function loadNotificationSettings(uid) {
  const defaults = { ...DEFAULT_NOTIFICATION_SETTINGS };
  if (!uid) {
    return { statusResponse: true, settings: defaults };
  }
  const result = await getCollectionWithId("Users", uid);
  if (!result.statusResponse) {
    return { statusResponse: false, settings: defaults, error: result.error };
  }
  return {
    statusResponse: true,
    settings: normalizeNotificationSettings(result.data?.notifications),
  };
}

export async function saveNotificationSettings(settings) {
  const user = getCurrentUser();
  if (!user?.uid) {
    return { statusResponse: false, error: "No hay sesión activa." };
  }
  const normalized = normalizeNotificationSettings(settings);
  const result = await updateDocument("Users", user.uid, {
    notifications: normalized,
  });
  if (!result.statusResponse) {
    return result;
  }
  return { statusResponse: true, settings: normalized };
}

export async function cancelAllAppointmentReminders() {
  if (Platform.OS === "web") {
    return;
  }
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    // Si el módulo nativo aún no está compilado, no interrumpe el resto de la app.
  }
}

function buildReminderContent(appointment, appointmentDate) {
  const name = (appointment.name || "sin nombre").trim();
  const patient = (appointment.namePatient || "sin paciente").trim();
  const when = moment(appointmentDate).format("dddd D [de] MMMM, h:mm a");
  return {
    title: "Cita próxima",
    body: `Se acerca la cita ${name} del paciente ${patient}.\n${when}`,
    sound: true,
    color: "#357288",
    channelId: CHANNEL_ID,
    priority: Notifications.AndroidNotificationPriority.MAX,
    data: {
      appointmentId: appointment.id || "",
    },
  };
}

async function scheduleOne(appointment, appointmentDate, triggerDate) {
  const now = Date.now();
  if (appointmentDate.getTime() <= now) {
    return false;
  }

  // Fecha absoluta en AlarmManager. El trigger por segundos, sin alarma
  // exacta, Android lo aplaza hasta que el teléfono o la app vuelvan a despertar.
  const fireAt =
    triggerDate.getTime() <= now ? new Date(now + 3000) : triggerDate;

  await Notifications.scheduleNotificationAsync({
    identifier: `${NOTIFICATION_PREFIX}${appointment.id}`,
    content: buildReminderContent(appointment, appointmentDate),
    trigger: {
      date: fireAt,
      channelId: CHANNEL_ID,
    },
  });
  return true;
}

async function scheduleReminders(settings, appointments) {
  await cancelAllAppointmentReminders();
  if (!settings.enabled) {
    return { scheduled: 0 };
  }

  const advanceMs = advanceToMillis(
    settings.advanceAmount,
    settings.advanceUnit
  );
  let scheduled = 0;

  for (const appointment of appointments) {
    const appointmentDate = toJsDate(appointment.dateAndTime);
    if (!appointmentDate || !appointment.id) {
      continue;
    }
    const triggerDate = new Date(appointmentDate.getTime() - advanceMs);
    try {
      const ok = await scheduleOne(appointment, appointmentDate, triggerDate);
      if (ok) {
        scheduled += 1;
      }
    } catch (error) {
      console.log("No se pudo programar la cita", appointment.id, error);
    }
  }

  return { scheduled };
}

export async function syncAppointmentReminders() {
  if (Platform.OS === "web") {
    return { statusResponse: true, scheduled: 0 };
  }

  const user = getCurrentUser();
  if (!user?.uid) {
    await cancelAllAppointmentReminders();
    return { statusResponse: true, scheduled: 0 };
  }

  try {
    await ensureAndroidChannel();
    const permission = await getNotificationPermission();
    const settingsResult = await loadNotificationSettings(user.uid);
    const settings = settingsResult.settings;

    if (!settings.enabled || !permission.granted) {
      await cancelAllAppointmentReminders();
      console.log("Recordatorios omitidos", {
        enabled: settings.enabled,
        granted: permission.granted,
        status: permission.status,
      });
      return { statusResponse: true, scheduled: 0 };
    }

    if (Platform.OS === "android") {
      await ensureBackgroundDelivery({ prompt: false });
    }

    const appointmentsResult = await getAppointments(null, user.uid);
    if (!appointmentsResult.statusResponse) {
      return {
        statusResponse: false,
        error: appointmentsResult.error,
        scheduled: 0,
      };
    }

    const { scheduled } = await scheduleReminders(
      settings,
      appointmentsResult.appointments || []
    );
    console.log(
      `Recordatorios programados: ${scheduled} de ${
        appointmentsResult.appointments?.length || 0
      } citas pendientes`
    );
    return { statusResponse: true, scheduled };
  } catch (error) {
    console.log("Error sincronizando recordatorios", error);
    return { statusResponse: false, error, scheduled: 0 };
  }
}

export async function sendTestNotification() {
  if (Platform.OS === "web") {
    return { statusResponse: false, error: "No disponible en web." };
  }
  try {
    await ensureAndroidChannel();
    const permission = await requestNotificationPermission();
    if (!permission.granted) {
      return {
        statusResponse: false,
        error: "Debes permitir las notificaciones en el teléfono.",
      };
    }
    if (Platform.OS === "android") {
      await ensureBackgroundDelivery({ prompt: true });
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Prueba de iCitas",
        body: "Si ves esto con la app cerrada, los avisos de citas van a la hora.",
        sound: true,
        color: "#357288",
        channelId: CHANNEL_ID,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        date: new Date(Date.now() + 15000),
        channelId: CHANNEL_ID,
      },
    });
    return { statusResponse: true };
  } catch (error) {
    console.log("Error en notificación de prueba", error);
    return {
      statusResponse: false,
      error: "No se pudo programar el aviso de prueba.",
    };
  }
}
