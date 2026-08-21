import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-easy-toast";
import { isEmpty } from "lodash";

import Loading from "../../components/Loading";
import { deleteDocument, updateDocument } from "../../utils/actions";
import {
  COLORS,
  FieldRow,
  HeaderDeleteButton,
  HeaderSaveButton,
  TAG_COLORS,
  styles as ui,
} from "../../components/appointments/appointmentFormUi";

export default function TagAccount({ navigation, route }) {
  const toasRef = useRef();
  const saveRef = useRef();
  const deleteRef = useRef();

  const { tag } = route.params;
  const { id, tagColor, tagName } = tag.item;

  const [dataSelected, setDataSelected] = useState({
    color: tagColor || TAG_COLORS[1],
    name: tagName,
  });
  const [errorName, setErrorName] = useState(null);
  const [loading, setLoading] = useState(false);

  const modifyTag = async () => {
    if (isEmpty((dataSelected.name || "").trim())) {
      setErrorName("Ingresa por favor un nombre para la etiqueta");
      return;
    }

    setLoading(true);
    const result = await updateDocument("UserTags", id, {
      tagName: dataSelected.name.trim(),
      tagColor: dataSelected.color,
    });
    setLoading(false);

    if (!result.statusResponse) {
      toasRef.current.show(
        "Error al guardar la etiqueta, intente nuevamente.",
        3000
      );
      return;
    }
    navigation.navigate("tags");
  };

  const askDeleteTag = () => {
    Alert.alert(
      "Eliminar Etiqueta",
      "¿Estas seguro de eliminar la etiqueta?",
      [
        { text: "No", style: "cancel" },
        { text: "Si", onPress: () => deleteTag() },
      ],
      { cancelable: true }
    );
  };

  const deleteTag = async () => {
    const result = await deleteDocument("UserTags", id);
    if (!result.statusResponse) {
      toasRef.current.show("Error al elimininar la etiqueta. ", 3000);
      return;
    }
    navigation.navigate("tags");
  };

  saveRef.current = modifyTag;
  deleteRef.current = askDeleteTag;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={ui.headerActions}>
          <HeaderDeleteButton
            onPress={() => deleteRef.current && deleteRef.current()}
          />
          <HeaderSaveButton
            onPress={() => saveRef.current && saveRef.current()}
          />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={ui.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Toast ref={toasRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text="Cargando..." />
      <ScrollView
        style={ui.container}
        contentContainerStyle={ui.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={ui.group}>
          <FieldRow
            iconName="tag"
            iconColor={COLORS.red}
            label="Nombre"
            error={errorName}
          >
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
          <FieldRow
            iconName="tint"
            iconColor={COLORS.teal}
            label="Color"
            alignTop
          >
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
