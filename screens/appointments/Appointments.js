import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { size } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getAppointments,
  getCurrentUser,
} from "../../utils/actions";
import ListAppointments from "./ListAppointments";
import Loading from "../../components/Loading";
import { COLORS } from "../../components/appointments/appointmentFormUi";

export default function Appointments({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getAppointments(null, getCurrentUser().uid);

        if (response.statusResponse) {
          setAppointments(response.appointments);
        }

        setLoading(false);
      }
      getData();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerWrap}>
        <SafeAreaView edges={["top"]}>
          <Text style={styles.titleHeader}>Citas Activas</Text>
        </SafeAreaView>
      </View>
      {size(appointments) > 0 ? (
        <ListAppointments
          appointments={appointments}
          navigation={navigation}
        />
      ) : (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>No existen citas</Text>
          <Text style={styles.notFoundHint}>
            Pulsa el botón para añadir una nueva cita
          </Text>
        </View>
      )}
      <Icon
        type="font-awesome"
        name="plus"
        color={COLORS.red}
        reverse={true}
        containerStyle={styles.btnContainer}
        size={24}
        onPress={() => navigation.navigate("add-appointment")}
      />
      <Loading isVisible={loading} text="Cargando Citas..." />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerWrap: {
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingBottom: 16,
    alignItems: "center",
    shadowColor: COLORS.header,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  titleHeader: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.2,
    textAlign: "center",
    paddingTop: 4,
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
