import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";
import uuid from "random-uuid-v4";
import { isEmpty } from "lodash";

import { getCountryCode, loadImageFromGallery } from "../../utils/helpers";
import {
  addDocumentWithoutId,
  getCurrentUser,
  uploadImage,
} from "../../utils/actions";
import {
  COLORS,
  FieldRow,
  HeaderSaveButton,
  styles as ui,
} from "../appointments/appointmentFormUi";
import ContactPickerButton from "./ContactPickerButton";

export default function AddSocialForm({ setLoading, toasRef, navigation }) {
  const [formData, setFormData] = useState(defaultFormValues());
  const [imageProfile, setImageProfile] = useState(null);
  const [errorName, setErrorName] = useState(null);
  const [errorNumberIdentify, setErrorNumberIdentify] = useState(null);
  const [errorPhone, setErrorPhone] = useState(null);
  const saveRef = useRef();

  const setField = (type, value) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const addSocialMember = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    let imageUrl = "";
    if (imageProfile) {
      const resultUploadImage = await uploadImage(
        imageProfile,
        "socialGroupImages",
        uuid()
      );
      if (!resultUploadImage.statusResponse) {
        setLoading(false);
        Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.");
        return;
      }
      imageUrl = resultUploadImage.url;
    }

    const memberData = {
      nameMember: formData.name,
      numberIdentifyMember: formData.numberIdentify,
      phoneNumber: formData.phoneNumber,
      callingCode: formData.callingCode,
      idMainUser: getCurrentUser().uid,
      images: imageUrl,
      idMemberUser: uuid(),
      createdDate: new Date(),
    };

    const responseAdd = await addDocumentWithoutId("SocialGroup", memberData);
    setLoading(false);

    if (!responseAdd.statusResponse) {
      toasRef.current.show("Error al guardar el integrante.", 3000);
      return;
    }
    navigation.navigate("social");
  };

  saveRef.current = addSocialMember;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderSaveButton onPress={() => saveRef.current && saveRef.current()} />
      ),
    });
  }, [navigation]);

  const validateForm = () => {
    setErrorNumberIdentify(null);
    setErrorName(null);
    setErrorPhone(null);
    let isValid = true;

    if (isEmpty(formData.name)) {
      setErrorName("Debes ingresar nombres y apellidos.");
      isValid = false;
    }
    if (isEmpty(formData.numberIdentify)) {
      setErrorNumberIdentify("Debes ingresar número de identificación.");
      isValid = false;
    }
    if (isEmpty(formData.phoneNumber)) {
      setErrorPhone("Debes ingresar número de teléfono.");
      isValid = false;
    }
    return isValid;
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
        <PhotoPicker image={imageProfile} onChange={setImageProfile} />

        <ContactPickerButton
          callingCode={formData.callingCode}
          toastRef={toasRef}
          onPicked={({ name, phoneNumber, callingCode, noPhone }) => {
            setFormData((prev) => ({
              ...prev,
              name: name || prev.name,
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
              value={formData.name}
              onChangeText={(text) => {
                setField("name", text);
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
              value={formData.numberIdentify}
              onChangeText={(text) => {
                setField("numberIdentify", text);
                setErrorNumberIdentify(null);
              }}
            />
          </FieldRow>
          <View style={ui.gdiv} />
          <PhoneRow
            formData={formData}
            setField={setField}
            errorPhone={errorPhone}
            setErrorPhone={setErrorPhone}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const defaultFormValues = () => ({
  name: "",
  numberIdentify: "",
  phoneNumber: "",
  callingCode: "57",
});

function PhoneRow({ formData, setField, errorPhone, setErrorPhone }) {
  const [country, setCountry] = useState(getCountryCode(formData.callingCode));

  useEffect(() => {
    setCountry(getCountryCode(formData.callingCode) || "CO");
  }, [formData.callingCode]);

  return (
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
  );
}

export function PhotoPicker({ image, onChange }) {
  const pick = async () => {
    const result = await loadImageFromGallery([1, 1]);
    if (!result.status) {
      return;
    }
    onChange(result.image);
  };

  return (
    <View style={[ui.group, styles.photoCard]}>
      <TouchableOpacity onPress={pick} activeOpacity={0.8}>
        <Image
          source={
            image
              ? { uri: image }
              : require("../../assets/avatar-default.jpg")
          }
          style={styles.photo}
        />
        <View style={styles.cameraBtn}>
          <Icon type="font-awesome" name="camera" size={14} color={COLORS.header} />
        </View>
      </TouchableOpacity>
      <Text style={styles.photoHint}>Toca para elegir foto</Text>
    </View>
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
  photoCard: {
    alignItems: "center",
    paddingVertical: 18,
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  cameraBtn: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  photoHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.label,
  },
});
