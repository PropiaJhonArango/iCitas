import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { size } from "lodash";

import Loading from "../../components/Loading";
import ListTags from "./ListTags";
import { getAllTags, getCurrentUser } from "../../utils/actions";
import { COLORS } from "../../components/appointments/appointmentFormUi";

export default function TagsAccount({ navigation }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getAllTags(getCurrentUser().uid);
        if (response.statusResponse) {
          const sorted = [...response.tags].sort((a, b) =>
            (a.tagName || "").localeCompare(b.tagName || "")
          );
          setTags(sorted);
        }
        setLoading(false);
      }
      getData();
    }, [])
  );

  return (
    <View style={styles.screen}>
      {size(tags) > 0 ? (
        <ListTags tags={tags} navigation={navigation} />
      ) : (
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>No existen etiquetas</Text>
          <Text style={styles.notFoundHint}>
            Pulsa el botón para añadir una nueva etiqueta
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
        onPress={() => navigation.navigate("add-tags")}
      />
      <Loading isVisible={loading} text="Cargando Etiquetas..." />
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
