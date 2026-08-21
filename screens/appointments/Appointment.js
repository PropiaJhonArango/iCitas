import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { isEmpty, size } from "lodash";
import Toast from "react-native-easy-toast";
import uuid from "random-uuid-v4";

import Loading from "../../components/Loading";
import {
  getAllSocialGroup,
  getAllTags,
  getCurrentUser,
  uploadImage,
  deleteDocument,
  updateDocument,
} from "../../utils/actions";
import {
  getAttachmentContentType,
  getAttachmentExtension,
  getAttachmentUri,
  isRemoteAttachment,
  normalizeAttachments,
} from "../../utils/helpers";
import { syncAppointmentReminders } from "../../utils/notifications";
import { askToSendAppointmentWhatsApp } from "../../utils/whatsapp";
import MapPickerModal from "../../components/appointments/MapPickerModal";
import AppointmentAttachments from "../../components/appointments/AppointmentAttachments";
import AppointmentDateTimePicker from "../../components/appointments/AppointmentDateTimePicker";
import {
  COLORS,
  FieldRow,
  HeaderDeleteButton,
  HeaderSaveButton,
  NewTagModal,
  PatientPickerModal,
  TagChips,
  styles,
  tagsToArray,
  toJsDate,
} from "../../components/appointments/appointmentFormUi";

export default function Appointment({ navigation, route }) {
  const toasRef = useRef();
  const saveRef = useRef();
  const deleteRef = useRef();

  const { appointment } = route.params;
  const {
    address,
    createAt,
    dateAndTime,
    doctor,
    id,
    idCreator,
    idPatient,
    idTags: initialIdTags,
    images,
    location,
    name,
    namePatient,
    notes,
  } = appointment.item;

  const initialData = {
    address,
    createAt,
    dateAndTime,
    doctor,
    id,
    idCreator,
    idPatient,
    idTags: initialIdTags,
    images,
    location,
    name,
    namePatient,
    notes,
  };

  const [formData, setFormData] = useState(initialData);
  const [errorName, setErrorName] = useState(null);
  const [errorDateAndTime, setErrorDateAndTime] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);
  const [memberPatients, setmemberPatients] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [userData] = useState(getCurrentUser());
  const [idTags, setIdTags] = useState(tagsToArray(initialIdTags));
  const [imagesSelected, setImagesSelected] = useState(
    normalizeAttachments(images)
  );
  const [locationAppointment, setLocationAppointment] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [visibleMap, setVisibleMap] = useState(false);
  const [visiblePatient, setVisiblePatient] = useState(false);
  const [visibleNewTag, setVisibleNewTag] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setLoading(true);
        const response = await getAllSocialGroup(userData.uid);

        const dataCurrentUser = {
          id: userData.uid,
          name: "Yo (" + userData.displayName + ")",
        };

        if (response.statusResponse) {
          const dataResult = response.socialGroup.map((doc) => ({
            id: doc.idMemberUser,
            name: doc.nameMember,
            phoneNumber: doc.phoneNumber,
            callingCode: doc.callingCode,
          }));
          dataResult.sort((a, b) => a.name.localeCompare(b.name));
          setmemberPatients([dataCurrentUser, ...dataResult]);
        }

        const responseTags = await getAllTags(userData.uid);
        if (responseTags.statusResponse) {
          const dataResultTags = responseTags.tags.map((doc) => ({
            id: doc.id,
            name: doc.tagName,
          }));
          dataResultTags.sort((a, b) => a.name.localeCompare(b.name));
          setUserTags(dataResultTags);
        }

        setLoading(false);
      }
      getData();
    }, [])
  );

  const setField = (type, value) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const handleConfirm = (datetime) => {
    setDatePickerVisibility(false);
    setField("dateAndTime", datetime);
    setErrorDateAndTime(null);
  };

  const modifiyAppointment = async () => {
    if (!validateForm()) {
      return;
    }

    const imagesFirebase = imagesSelected
      .filter((item) => isRemoteAttachment(getAttachmentUri(item)))
      .map((item) => getAttachmentUri(item));
    const imagesLocal = imagesSelected.filter(
      (item) => !isRemoteAttachment(getAttachmentUri(item))
    );

    let resultUploadImage = [];
    if (size(imagesLocal) > 0) {
      resultUploadImage = await uploadImages(imagesLocal);
    }
    const finalImages = [...imagesFirebase, ...resultUploadImage];

    const payload = {
      ...formData,
      images: finalImages,
      idTags: { ...idTags },
      namePatient: getNamePatientById(formData.idPatient) || formData.namePatient,
    };
    if (locationAppointment) {
      payload.location = locationAppointment;
    }

    setLoading(true);
    const result = await updateDocument("Appointments", id, payload);

    if (!result.statusResponse) {
      toasRef.current.show("Error al modificar la cita. ", 3000);
      setLoading(false);
      return;
    }
    await syncAppointmentReminders();
    setLoading(false);
    const patient = memberPatients.find((item) => item.id === payload.idPatient);
    const offered = askToSendAppointmentWhatsApp({
      patient,
      appointment: payload,
      userTags,
      isUpdate: true,
      onFinish: goBackToList,
    });
    if (!offered) {
      goBackToList();
    }
  };

  const goBackToList = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("appointments");
  };

  saveRef.current = modifiyAppointment;

  const validateForm = () => {
    setErrorName(null);
    setErrorDateAndTime(null);
    setErrorAddress(null);

    let isValidForm = true;

    if (isEmpty(formData.name)) {
      setErrorName("Ingresa por favor un nombre para la cita.");
      isValidForm = false;
    }

    if (!toJsDate(formData.dateAndTime)) {
      setErrorDateAndTime("Ingresa por favor una fecha para la cita.");
      isValidForm = false;
    }

    if (isEmpty(formData.address)) {
      setErrorAddress("Ingresa una dirección ó clínica.");
      isValidForm = false;
    }

    if (isEmpty(formData.idPatient)) {
      toasRef.current.show("Debes elegir un paciente para la cita.", 3000);
      isValidForm = false;
    }

    return isValidForm;
  };

  const getNamePatientById = (patientId) => {
    const match = memberPatients.filter((patient) => patient.id === patientId);
    return match.map((patient) => patient.name)[0];
  };

  const askDeleteAppointment = () => {
    Alert.alert(
      "Eliminar Cita",
      "¿Estas seguro de eliminar la cita?",
      [
        { text: "No", style: "cancel" },
        { text: "Si", onPress: () => deleteAppointment() },
      ],
      { cancelable: true }
    );
  };

  deleteRef.current = askDeleteAppointment;

  const deleteAppointment = async () => {
    const result = await deleteDocument("Appointments", id);

    if (!result.statusResponse) {
      toasRef.current.show("Error al elimininar la cita. ", 3000);
      return;
    }
    await syncAppointmentReminders();
    goBackToList();
  };

  const uploadImages = async (newImages) => {
    const imagesUrl = [];
    await Promise.all(
      newImages.map(async (item) => {
        const uri = getAttachmentUri(item);
        const ext = getAttachmentExtension(item);
        const contentType = getAttachmentContentType(item);
        const response = await uploadImage(
          uri,
          "appointmentsImages",
          `${uuid()}.${ext}`,
          contentType
        );
        if (response.statusResponse) {
          imagesUrl.push(response.url);
        }
      })
    );
    return imagesUrl;
  };

  const toggleTag = (tagId) => {
    let next = [...idTags];
    if (next.includes(tagId)) {
      next = next.filter((item) => item !== tagId);
    } else {
      if (size(next) >= 3) {
        toasRef.current.show("Solo puedes elegir 3 etiquetas por cita", 3000);
        return;
      }
      next.push(tagId);
    }
    setIdTags(next);
    setFormData((prev) => ({ ...prev, idTags: { ...next } }));
  };

  const onTagCreated = (newTag) => {
    setUserTags((prev) =>
      [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name))
    );
    if (size(idTags) < 3) {
      const next = [...idTags, newTag.id];
      setIdTags(next);
      setFormData((prev) => ({ ...prev, idTags: { ...next } }));
    }
  };

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
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

  const dateValue = toJsDate(formData.dateAndTime);
  const dateLabel = dateValue
    ? moment(dateValue).format("YYYY-MM-DD hh:mm A")
    : "";
  const patientName =
    getNamePatientById(formData.idPatient) || formData.namePatient;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Loading isVisible={loading} text="Cargando..." />
      <Toast ref={toasRef} position="center" opacity={0.9} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.group}>
          <FieldRow
            iconName="commenting-o"
            iconColor={COLORS.teal}
            label="Nombre cita"
            error={errorName}
          >
            <TextInput
              style={styles.ginput}
              placeholder="Nombre o descripción…"
              placeholderTextColor={COLORS.placeholder}
              value={formData.name}
              onChangeText={(text) => {
                setField("name", text);
                setErrorName(null);
              }}
            />
          </FieldRow>
          <View style={styles.gdiv} />
          <FieldRow
            iconName="calendar"
            iconColor={COLORS.teal}
            label="Fecha / Hora"
            error={errorDateAndTime}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text style={dateLabel ? styles.gval : styles.gph}>
              {dateLabel || "Elegir fecha y hora"}
            </Text>
          </FieldRow>
          <View style={styles.gdiv} />
          <FieldRow
            iconName="map-marker"
            iconColor={COLORS.teal}
            label="Dirección ó clínica"
            error={errorAddress}
            onIconPress={() => setVisibleMap(true)}
            rightIcon="map-o"
            onRightPress={() => setVisibleMap(true)}
          >
            <TextInput
              style={styles.ginput}
              placeholder="Dirección de la cita"
              placeholderTextColor={COLORS.placeholder}
              value={formData.address}
              onChangeText={(text) => {
                setField("address", text);
                setErrorAddress(null);
              }}
              multiline
            />
          </FieldRow>
        </View>

        <View style={styles.group}>
          <FieldRow
            iconName="user"
            iconColor={COLORS.blue}
            label="Paciente"
            onPress={() => setVisiblePatient(true)}
            chevron
          >
            <Text style={patientName ? styles.gval : styles.gph}>
              {patientName || "Seleccionar paciente"}
            </Text>
          </FieldRow>
          <View style={styles.gdiv} />
          <FieldRow
            iconName="user-md"
            iconColor={COLORS.blue}
            label="Médico"
          >
            <TextInput
              style={styles.ginput}
              placeholder="Nombre del médico"
              placeholderTextColor={COLORS.placeholder}
              value={formData.doctor || ""}
              onChangeText={(text) => setField("doctor", text)}
            />
          </FieldRow>
        </View>

        <View style={styles.group}>
          <FieldRow
            iconName="tag"
            iconColor={COLORS.red}
            label="Etiquetas"
            alignTop
          >
            <TagChips
              tags={userTags}
              selectedIds={idTags}
              onToggle={toggleTag}
              onAdd={() => setVisibleNewTag(true)}
            />
          </FieldRow>
          <View style={styles.gdiv} />
          <FieldRow
            iconName="comments-o"
            iconColor={COLORS.mutedIcon}
            label="Notas"
            alignTop
          >
            <TextInput
              style={[styles.ginput, styles.notesInput]}
              placeholder="Añadir notas…"
              placeholderTextColor={COLORS.placeholder}
              value={formData.notes || ""}
              onChangeText={(text) => setField("notes", text)}
              multiline
              textAlignVertical="top"
            />
          </FieldRow>
          <View style={styles.gdiv} />
          <FieldRow
            iconName="paperclip"
            iconColor={COLORS.mutedIcon}
            label="Imágenes / PDF"
            alignTop
          >
            <AppointmentAttachments
              attachments={imagesSelected}
              setAttachments={setImagesSelected}
            />
          </FieldRow>
        </View>
      </ScrollView>

      <AppointmentDateTimePicker
        isVisible={isDatePickerVisible}
        date={toJsDate(formData.dateAndTime) || new Date()}
        minimumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <MapPickerModal
        isVisible={visibleMap}
        setVisible={setVisibleMap}
        initialLocation={locationAppointment || initialData.location}
        initialAddress={formData.address}
        toastRef={toasRef}
        onSave={(newLocation, newAddress) => {
          setLocationAppointment(newLocation);
          setFormData((prev) => ({ ...prev, address: newAddress }));
          setErrorAddress(null);
        }}
      />

      <PatientPickerModal
        isVisible={visiblePatient}
        setVisible={setVisiblePatient}
        patients={memberPatients}
        selectedId={formData.idPatient}
        onSelect={(patientId) => {
          setField("idPatient", patientId);
          setVisiblePatient(false);
        }}
      />

      <NewTagModal
        isVisible={visibleNewTag}
        setVisible={setVisibleNewTag}
        existingTags={userTags}
        onCreated={onTagCreated}
        toastRef={toasRef}
      />
    </KeyboardAvoidingView>
  );
}
