import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import AddAppointmentForm from "../../components/appointments/AddAppointmentForm";

export default function AddAppointment({ navigation }) {
  const toasRef = useRef();
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <AddAppointmentForm
        setLoading={setLoading}
        toasRef={toasRef}
        navigation={navigation}
      />
      <Loading isVisible={loading} text="Cargando..." />
      <Toast ref={toasRef} position="center" opacity={0.9} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceae6",
  },
});
