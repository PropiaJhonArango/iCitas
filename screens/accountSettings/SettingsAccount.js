import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";

import {
  COLORS,
  ScreenHeader,
  styles as ui,
} from "../../components/appointments/appointmentFormUi";
import { getCurrentUser } from "../../utils/actions";
import {
  formatAdvanceLabel,
  loadNotificationSettings,
} from "../../utils/notifications";

export default function SettingsAccount({ navigation }) {
  const [notificationsSub, setNotificationsSub] = useState(
    "Recordatorios de citas"
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        const result = await loadNotificationSettings(getCurrentUser()?.uid);
        if (!active || !result.statusResponse) {
          return;
        }
        const { enabled, advanceAmount, advanceUnit } = result.settings;
        setNotificationsSub(
          enabled
            ? `Aviso ${formatAdvanceLabel(advanceAmount, advanceUnit)} antes`
            : "Recordatorios de citas"
        );
      }
      load();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Ajustes" />
      <View style={styles.body}>
        <Text style={styles.intro}>
          Configura a tu gusto las características de iCitas
        </Text>

        <View style={ui.group}>
          <SettingRow
            icon="tags"
            iconColor={COLORS.red}
            title="Etiquetas"
            subtitle="Administra tus propias etiquetas"
            onPress={() => navigation.navigate("tags")}
          />
        </View>

        <View style={[ui.group, { marginTop: 12 }]}>
          <SettingRow
            icon="bell-o"
            iconColor={COLORS.header}
            title="Notificaciones"
            subtitle={notificationsSub}
            onPress={() => navigation.navigate("notifications")}
          />
        </View>
      </View>
    </View>
  );
}

function SettingRow({ icon, iconColor, title, subtitle, onPress, disabled }) {
  const content = (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Icon type="font-awesome" name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      {!disabled && (
        <Icon
          type="font-awesome"
          name="chevron-right"
          size={14}
          color={COLORS.chevron}
        />
      )}
    </View>
  );

  if (disabled) {
    return <View style={{ opacity: 0.55 }}>{content}</View>;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  intro: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.label,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
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
  texts: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.value,
  },
  rowSub: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.label,
    marginTop: 2,
  },
});
