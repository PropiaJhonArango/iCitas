import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import AddSocialForm from "../../components/social/AddSocialForm";
import { COLORS } from "../../components/appointments/appointmentFormUi";

export default function AddSocial({ navigation }) {
  const toasRef = useRef();
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <AddSocialForm
        setLoading={setLoading}
        toasRef={toasRef}
        navigation={navigation}
      />
      <Loading isVisible={loading} text="Registrando Integrante." />
      <Toast ref={toasRef} position="center" opacity={0.9} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
