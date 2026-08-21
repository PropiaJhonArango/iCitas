import React, { useCallback, useRef, useState } from "react";
import {
  AppState,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";

import Loading from "../../components/Loading";
import {
  COLORS,
  styles as ui,
} from "../../components/appointments/appointmentFormUi";
import { getCurrentUser } from "../../utils/actions";
import {
  formatAdvanceLabel,
  loadNotificationSettings,
  requestNotificationPermission,
  saveNotificationSettings,
  sendTestNotification,
  syncAppointmentReminders,
} from "../../utils/notifications";
import {
  ensureBackgroundDelivery,
  getBackgroundDeliveryStatus,
  isXiaomiDevice,
  openAppNotificationSettings,
  openExactAlarmSettings,
  requestUnrestrictedBattery,
} from "../../utils/reminderAlarms";

export default function NotificationsSettings() {
  const toastRef = useRef();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("30");
  const [advanceUnit, setAdvanceUnit] = useState("minutes");
  const [exactAlarms, setExactAlarms] = useState(true);
  const [batteryUnrestricted, setBatteryUnrestricted] = useState(true);

  const refreshDelivery = async () => {
    const status = await getBackgroundDeliveryStatus();
    setExactAlarms(status.exactAlarms);
    setBatteryUnrestricted(status.batteryUnrestricted);
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setLoading(true);
        const result = await loadNotificationSettings(getCurrentUser()?.uid);
        if (!active) {
          return;
        }
        if (result.statusResponse) {
          setEnabled(result.settings.enabled);
          setAdvanceAmount(String(result.settings.advanceAmount));
          setAdvanceUnit(result.settings.advanceUnit);
        }
        await refreshDelivery();
        setLoading(false);
      }
      load();
      const sub = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          refreshDelivery();
        }
      });
      return () => {
        active = false;
        sub.remove();
      };
    }, [])
  );

  const persist = async (next) => {
    const settings = {
      enabled: next.enabled,
      advanceAmount: next.advanceAmount,
      advanceUnit: next.advanceUnit,
    };
    setSaving(true);
    const saved = await saveNotificationSettings(settings);
    if (!saved.statusResponse) {
      setSaving(false);
      toastRef.current?.show(
        "No se pudo guardar la configuración. Intenta de nuevo.",
        3000
      );
      return false;
    }
    const synced = await syncAppointmentReminders();
    setSaving(false);
    if (!synced.statusResponse) {
      toastRef.current?.show(
        "La configuración se guardó, pero no se pudieron programar las notificaciones.",
        3500
      );
      return false;
    }
    if (next.enabled) {
      toastRef.current?.show(
        synced.scheduled > 0
          ? `Listo. Hay ${synced.scheduled} aviso(s) programado(s).`
          : "Notificaciones activas. Crea una cita unos minutos en el futuro para probar.",
        3000
      );
    }
    return true;
  };

  const onToggle = async (value) => {
    if (value) {
      const permission = await requestNotificationPermission();
      if (!permission.granted) {
        toastRef.current?.show(
          "Debes permitir las notificaciones en el teléfono para activar los recordatorios.",
          3500
        );
        return;
      }
      await ensureBackgroundDelivery({ prompt: true });
      await refreshDelivery();
    }

    const amount = parseInt(advanceAmount, 10);
    const previous = enabled;
    setEnabled(value);
    const ok = await persist({
      enabled: value,
      advanceAmount: Number.isFinite(amount) && amount > 0 ? amount : 30,
      advanceUnit,
    });
    if (!ok) {
      setEnabled(previous);
      return;
    }
  };

  const onChangeUnit = async (unit) => {
    if (unit === advanceUnit) {
      return;
    }
    setAdvanceUnit(unit);
    if (!enabled) {
      return;
    }
    const amount = parseInt(advanceAmount, 10);
    if (!Number.isFinite(amount) || amount < 1) {
      return;
    }
    await persist({
      enabled,
      advanceAmount: amount,
      advanceUnit: unit,
    });
  };

  const onSaveAmount = async () => {
    const amount = parseInt(advanceAmount, 10);
    if (!Number.isFinite(amount) || amount < 1) {
      toastRef.current?.show("Ingresa un tiempo mayor a 0.", 2500);
      setAdvanceAmount("30");
      return;
    }
    const max = advanceUnit === "hours" ? 168 : 10080;
    const safeAmount = Math.min(amount, max);
    if (safeAmount !== amount) {
      setAdvanceAmount(String(safeAmount));
      toastRef.current?.show(
        "El tiempo máximo es de 7 días. Se ajustó el valor.",
        3000
      );
    } else {
      setAdvanceAmount(String(safeAmount));
    }
    if (!enabled) {
      return;
    }
    await persist({
      enabled,
      advanceAmount: safeAmount,
      advanceUnit,
    });
  };

  const onTest = async () => {
    setSaving(true);
    const result = await sendTestNotification();
    setSaving(false);
    if (!result.statusResponse) {
      toastRef.current?.show(
        result.error || "No se pudo enviar el aviso de prueba.",
        3000
      );
      return;
    }
    toastRef.current?.show(
      "Cierra iCitas del todo (quitarla de recientes). En 15 segundos debe sonar el aviso.",
      5000
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={ui.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.intro}>
          Activa los recordatorios y elige con cuánta anticipación quieres el
          aviso de cada cita pendiente. El aviso debe salir aunque iCitas esté
          cerrada.
        </Text>

        <View style={ui.group}>
          <View style={styles.switchRow}>
            <View style={styles.iconWrap}>
              <Icon
                type="font-awesome"
                name="bell"
                size={16}
                color={enabled ? COLORS.red : COLORS.mutedIcon}
              />
            </View>
            <View style={styles.switchTexts}>
              <Text style={styles.switchTitle}>Recibir notificaciones</Text>
              <Text style={styles.switchSub}>
                Aviso en el teléfono, como WhatsApp
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={onToggle}
              trackColor={{ false: "#d5d8dc", true: COLORS.header }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {enabled && (
          <View style={[ui.group, { marginTop: 12 }]}>
            <View style={styles.advanceBlock}>
              <Text style={styles.sectionLabel}>Anticipación</Text>
              <Text style={styles.sectionHint}>
                Te avisaremos {formatAdvanceLabel(advanceAmount, advanceUnit)}{" "}
                antes de cada cita pendiente.
              </Text>

              <View style={styles.amountRow}>
                <TextInput
                  style={styles.amountInput}
                  value={advanceAmount}
                  onChangeText={(text) =>
                    setAdvanceAmount(text.replace(/[^0-9]/g, ""))
                  }
                  onEndEditing={onSaveAmount}
                  keyboardType="number-pad"
                  maxLength={5}
                  placeholder="30"
                  placeholderTextColor={COLORS.placeholder}
                />
                <View style={styles.unitRow}>
                  <UnitChip
                    label="Minutos"
                    active={advanceUnit === "minutes"}
                    onPress={() => onChangeUnit("minutes")}
                  />
                  <UnitChip
                    label="Horas"
                    active={advanceUnit === "hours"}
                    onPress={() => onChangeUnit("hours")}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {enabled && (
          <View style={[ui.group, { marginTop: 12 }]}>
            <View style={styles.advanceBlock}>
              <Text style={styles.sectionLabel}>Entrega en segundo plano</Text>
              <Text style={styles.sectionHint}>
                Sin estos permisos Android retrasa el aviso hasta que vuelvas a
                abrir iCitas. Pasa igual en la versión instalada, no solo en
                desarrollo.
              </Text>
              <DeliveryRow
                ok={exactAlarms}
                title="Alarmas exactas"
                subtitle={
                  exactAlarms
                    ? "El teléfono puede despertar a la hora de la cita"
                    : "Actívalas o el aviso llegará tarde"
                }
                actionLabel={exactAlarms ? "Revisar" : "Activar"}
                onPress={async () => {
                  await openExactAlarmSettings();
                }}
              />
              <View style={ui.gdiv} />
              <DeliveryRow
                ok={batteryUnrestricted}
                title="Batería sin restricciones"
                subtitle={
                  batteryUnrestricted
                    ? "iCitas no será cerrada por ahorro de energía"
                    : "Xiaomi/Android puede matar la app dormida"
                }
                actionLabel={batteryUnrestricted ? "Revisar" : "Permitir"}
                onPress={async () => {
                  await requestUnrestrictedBattery();
                }}
              />
              {isXiaomiDevice() && (
                <>
                  <View style={ui.gdiv} />
                  <DeliveryRow
                    ok={exactAlarms && batteryUnrestricted}
                    title="Inicio automático (Xiaomi)"
                    subtitle="En la ficha de iCitas activa inicio automático y batería sin restricciones"
                    actionLabel="Abrir"
                    onPress={openAppNotificationSettings}
                  />
                </>
              )}
            </View>
          </View>
        )}

        {enabled && (
          <TouchableOpacity
            style={styles.testBtn}
            onPress={onTest}
            activeOpacity={0.8}
          >
            <Icon
              type="font-awesome"
              name="bell"
              size={14}
              color={COLORS.white}
            />
            <Text style={styles.testBtnText}>
              Probar aviso con la app cerrada (15 s)
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Loading
        isVisible={loading || saving}
        text={saving ? "Guardando..." : "Cargando..."}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </KeyboardAvoidingView>
  );
}

function DeliveryRow({ ok, title, subtitle, actionLabel, onPress }) {
  return (
    <View style={styles.deliveryRow}>
      <View
        style={[
          styles.deliveryDot,
          { backgroundColor: ok ? "#22af1b" : COLORS.red },
        ]}
      />
      <View style={styles.switchTexts}>
        <Text style={styles.switchTitle}>{title}</Text>
        <Text style={styles.switchSub}>{subtitle}</Text>
      </View>
      <TouchableOpacity onPress={onPress} hitSlop={8}>
        <Text style={styles.deliveryAction}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

function UnitChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  intro: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.label,
    textAlign: "center",
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#f6f5f3",
    alignItems: "center",
    justifyContent: "center",
  },
  switchTexts: {
    flex: 1,
    minWidth: 0,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.value,
  },
  switchSub: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.label,
    marginTop: 2,
  },
  advanceBlock: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLORS.label,
  },
  sectionHint: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.value,
    marginTop: 6,
    marginBottom: 14,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  amountInput: {
    width: 78,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f6f5f3",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.value,
  },
  unitRow: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.chipBg,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.chipText,
  },
  chipTextActive: {
    color: COLORS.chipActiveText,
  },
  testBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.header,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  testBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  deliveryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  deliveryAction: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.teal,
  },
});
