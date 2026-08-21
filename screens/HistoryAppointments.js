import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { size } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getAppointmentsExpired,
  getCurrentUser,
} from "../utils/actions";
import ListAppointments from "./appointments/ListAppointments";
import Loading from "../components/Loading";
import { COLORS } from "../components/appointments/appointmentFormUi";

export default function HistoryAppointments({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getAppointmentsExpired(
          null,
          getCurrentUser().uid
        );
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
          <Text style={styles.titleHeader}>Citas Antiguas</Text>
        </SafeAreaView>
      </View>
      {size(appointments) > 0 ? (
        <ListAppointments
          appointments={appointments}
          navigation={navigation}
        />
      ) : (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>No existen citas vencidas</Text>
        </View>
      )}
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
});
