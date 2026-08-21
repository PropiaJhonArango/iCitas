import { isEmpty } from "lodash";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { addDocumentWithoutId, getCurrentUser } from "../../utils/actions";
import {
  COLORS,
  FieldRow,
  HeaderSaveButton,
  TAG_COLORS,
  styles as ui,
} from "../appointments/appointmentFormUi";

export default function AddTagsForm({ setLoading, toasRef, navigation }) {
  const [dataSelected, setDataSelected] = useState({
    name: "",
    color: TAG_COLORS[1],
  });
  const [errorName, setErrorName] = useState(null);
  const saveRef = useRef();

  const addTag = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const response = await addDocumentWithoutId("UserTags", {
      tagName: dataSelected.name.trim(),
      tagColor: dataSelected.color,
      ownerId: getCurrentUser().uid,
      createdDate: new Date(),
    });
    setLoading(false);

    if (!response.statusResponse) {
      toasRef.current.show(
        "Error al guardar la etiqueta, intente nuevamente.",
        3000
      );
      return;
    }
    navigation.navigate("tags");
  };

  saveRef.current = addTag;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderSaveButton onPress={() => saveRef.current && saveRef.current()} />
      ),
    });
  }, [navigation]);

  const validateForm = () => {
    if (isEmpty(dataSelected.name.trim())) {
      setErrorName("Ingresa por favor un nombre para la etiqueta");
      return false;
    }
    setErrorName(null);
    return true;
  };

  return (
    <KeyboardAvoidingView
      style={ui.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={ui.container}
        contentContainerStyle={ui.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={ui.group}>
          <FieldRow iconName="tag" iconColor={COLORS.red} label="Nombre" error={errorName}>
            <TextInput
              style={ui.ginput}
              placeholder="Nombre de la etiqueta"
              placeholderTextColor={COLORS.placeholder}
              value={dataSelected.name}
              onChangeText={(text) => {
                setDataSelected((prev) => ({ ...prev, name: text }));
                setErrorName(null);
              }}
            />
          </FieldRow>
          <View style={ui.gdiv} />
          <FieldRow iconName="tint" iconColor={COLORS.teal} label="Color" alignTop>
            <View style={styles.colors}>
              {TAG_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.dot,
                    { backgroundColor: color },
                    dataSelected.color === color && styles.dotSelected,
                  ]}
                  onPress={() =>
                    setDataSelected((prev) => ({ ...prev, color }))
                  }
                />
              ))}
            </View>
          </FieldRow>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  colors: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  dotSelected: {
    borderWidth: 3,
    borderColor: COLORS.value,
  },
});
