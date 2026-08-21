import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import uuid from "random-uuid-v4";
import Toast from "react-native-easy-toast";
import { isEmpty } from "lodash";

import { getCountryCode } from "../../utils/helpers";
import {
  deleteDocument,
  updateDocument,
  uploadImage,
} from "../../utils/actions";
import Loading from "../../components/Loading";
import { PhotoPicker } from "../../components/social/AddSocialForm";
import ContactPickerButton from "../../components/social/ContactPickerButton";
import {
  COLORS,
  FieldRow,
  HeaderDeleteButton,
  HeaderSaveButton,
  styles as ui,
} from "../../components/appointments/appointmentFormUi";

export default function MemberDetails({ navigation, route }) {
  const toasRef = useRef();
  const saveRef = useRef();
  const deleteRef = useRef();
  const { socialMember } = route.params;
  const {
    callingCode,
    images,
    nameMember,
    numberIdentifyMember,
    phoneNumber,
    id,
  } = socialMember.item;

  const [formData, setFormData] = useState({
    callingCode,
    images,
    nameMember,
    numberIdentifyMember,
    phoneNumber,
    id,
  });
  const [imageProfile, setImageProfile] = useState(images);
  const [errorName, setErrorName] = useState(null);
  const [errorNumberIdentify, setErrorNumberIdentify] = useState(null);
  const [errorPhone, setErrorPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(getCountryCode(callingCode));

  useEffect(() => {
    setCountry(getCountryCode(formData.callingCode) || "CO");
  }, [formData.callingCode]);

  const setField = (type, value) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const modifyMember = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const payload = { ...formData };

    if (imageProfile && String(imageProfile).includes("file:/")) {
      const response = await uploadImage(
        imageProfile,
        "socialGroupImages",
        uuid()
      );
      if (response.statusResponse) {
        payload.images = response.url;
      }
    } else {
      payload.images = imageProfile;
    }

    const result = await updateDocument("SocialGroup", id, payload);
    setLoading(false);

    if (!result.statusResponse) {
      toasRef.current.show("Error al modificar el integrante. ", 3000);
      return;
    }
    navigation.navigate("social");
  };

  const askDeleteMember = () => {
    Alert.alert(
      "Eliminar Integrante",
      "¿Estas seguro de eliminar el integrante?",
      [
        { text: "No", style: "cancel" },
        { text: "Si", onPress: () => deleteMember() },
      ],
      { cancelable: true }
    );
  };

  const deleteMember = async () => {
    const result = await deleteDocument("SocialGroup", id);
    if (!result.statusResponse) {
      toasRef.current.show("Error al elimininar el integrante. ", 3000);
      return;
    }
    navigation.navigate("social");
  };

  const validateForm = () => {
    setErrorNumberIdentify(null);
    setErrorName(null);
    setErrorPhone(null);
    let isValid = true;
    if (isEmpty(formData.nameMember)) {
      setErrorName("Debes ingresar nombres y apellidos.");
      isValid = false;
    }
    if (isEmpty(formData.numberIdentifyMember)) {
      setErrorNumberIdentify("Debes ingresar número de identificación.");
      isValid = false;
    }
    if (isEmpty(formData.phoneNumber)) {
      setErrorPhone("Debes ingresar número de teléfono.");
      isValid = false;
    }
    return isValid;
  };

  saveRef.current = modifyMember;
  deleteRef.current = askDeleteMember;

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
      <Loading isVisible={loading} text="Cargando..." />
      <Toast ref={toasRef} position="center" opacity={0.9} />
      <ScrollView
        style={ui.container}
        contentContainerStyle={ui.body}
        keyboardShouldPersistTaps="handled"
      >
        <PhotoPicker image={imageProfile} onChange={setImageProfile} />
        <ContactPickerButton
          callingCode={formData.callingCode}
          toastRef={toasRef}
          onPicked={({ name, phoneNumber, callingCode, noPhone }) => {
            setFormData((prev) => ({
              ...prev,
              nameMember: name || prev.nameMember,
              phoneNumber: noPhone ? prev.phoneNumber : phoneNumber,
              callingCode: callingCode || prev.callingCode,
            }));
            if (name) {
              setErrorName(null);
            }
            if (!noPhone && phoneNumber) {
              setErrorPhone(null);
            }
          }}
        />
        <View style={ui.group}>
          <FieldRow
            iconName="user"
            iconColor={COLORS.blue}
            label="Nombre completo"
            error={errorName}
          >
            <TextInput
              style={ui.ginput}
              placeholder="Nombre integrante..."
              placeholderTextColor={COLORS.placeholder}
              value={formData.nameMember}
              onChangeText={(text) => {
                setField("nameMember", text);
                setErrorName(null);
              }}
            />
          </FieldRow>
          <View style={ui.gdiv} />
          <FieldRow
            iconName="id-badge"
            iconColor={COLORS.blue}
            label="Nro. identidad"
            error={errorNumberIdentify}
          >
            <TextInput
              style={ui.ginput}
              placeholder="Documento de identidad..."
              placeholderTextColor={COLORS.placeholder}
              keyboardType="number-pad"
              value={formData.numberIdentifyMember}
              onChangeText={(text) => {
                setField("numberIdentifyMember", text);
                setErrorNumberIdentify(null);
              }}
            />
          </FieldRow>
          <View style={ui.gdiv} />
          <FieldRow
            iconName="phone"
            iconColor={COLORS.teal}
            label="Teléfono"
            error={errorPhone}
            alignTop
          >
            <View style={styles.phoneRow}>
              <CountryPicker
                withFlag
                withCallingCode
                withFilter
                withCallingCodeButton
                countryCode={country}
                callingCode={formData.callingCode}
                onSelect={(selected) => {
                  setCountry(selected.cca2);
                  setField("callingCode", selected.callingCode[0]);
                }}
              />
              <TextInput
                style={[ui.ginput, styles.phoneInput]}
                placeholder="Número celular..."
                placeholderTextColor={COLORS.placeholder}
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) => {
                  setField("phoneNumber", text);
                  setErrorPhone(null);
                }}
              />
            </View>
          </FieldRow>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneInput: {
    flex: 1,
  },
});
