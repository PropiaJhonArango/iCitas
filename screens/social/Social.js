import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { size } from "lodash";

import {
  getAllSocialGroup,
  getCurrentUser,
} from "../../utils/actions";
import Loading from "../../components/Loading";
import ListSocialGroup from "./ListSocialGroup";
import {
  COLORS,
  ScreenHeader,
} from "../../components/appointments/appointmentFormUi";

export default function Social({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [socialGroup, setSocialGroup] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getAllSocialGroup(getCurrentUser().uid);
        if (response.statusResponse) {
          const sorted = [...response.socialGroup].sort((a, b) =>
            (a.nameMember || "").localeCompare(b.nameMember || "")
          );
          setSocialGroup(sorted);
        }
        setLoading(false);
      }
      getData();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Grupo Social" />
      {size(socialGroup) > 0 ? (
        <ListSocialGroup socialGroup={socialGroup} navigation={navigation} />
      ) : (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>
            No tienes integrantes en tu círculo social
          </Text>
          <Text style={styles.notFoundHint}>
            Pulsa el botón para añadir un nuevo integrante
          </Text>
        </View>
      )}
      <Loading isVisible={loading} text="Cargando Integrantes..." />
      <Icon
        type="font-awesome"
        name="plus"
        color={COLORS.red}
        reverse={true}
        containerStyle={styles.btnContainer}
        size={24}
        onPress={() => navigation.navigate("add-social")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  btnContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  notFoundView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.value,
    textAlign: "center",
  },
  notFoundHint: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.label,
    textAlign: "center",
  },
});
