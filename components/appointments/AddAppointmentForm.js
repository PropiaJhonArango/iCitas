import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import AppointmentDateTimePicker from "./AppointmentDateTimePicker";
import moment from "moment";
import { isDate, isEmpty, size } from "lodash";
import uuid from "random-uuid-v4";
import { useFocusEffect } from "@react-navigation/native";

import {
  addDocumentWithoutId,
  getAllSocialGroup,
  getAllTags,
  getCurrentUser,
  uploadImage,
} from "../../utils/actions";
import {
  getAttachmentContentType,
  getAttachmentExtension,
  getAttachmentUri,
} from "../../utils/helpers";
import { syncAppointmentReminders } from "../../utils/notifications";
import { askToSendAppointmentWhatsApp } from "../../utils/whatsapp";
import MapPickerModal from "./MapPickerModal";
import AppointmentAttachments from "./AppointmentAttachments";
import {
  COLORS,
  FieldRow,
  HeaderSaveButton,
  NewTagModal,
  PatientPickerModal,
  TagChips,
  styles,
} from "./appointmentFormUi";

function getSoonestAppointmentDate() {
  const min = new Date();
  min.setSeconds(0, 0);
  min.setMilliseconds(0);
  min.setMinutes(min.getMinutes() + 1);
  return min;
}

export default function AddAppointmentForm({
  setLoading,
  toasRef,
  navigation,
}) {
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorName, setErrorName] = useState(null);
  const [errorDateAndTime, setErrorDateAndTime] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);
  const [errorDoctor, setErrorDoctor] = useState(null);
  const [imagesSelected, setImagesSelected] = useState([]);
  const [idTags, setIdTags] = useState([]);
  const [userData] = useState(getCurrentUser());
  const [visibleMap, setVisibleMap] = useState(false);
  const [visiblePatient, setVisiblePatient] = useState(false);
  const [visibleNewTag, setVisibleNewTag] = useState(false);
  const [locationAppointment, setLocationAppointment] = useState(null);
  const [memberPatients, setmemberPatients] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerDate, setPickerDate] = useState(getSoonestAppointmentDate);

  const saveRef = useRef();

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

  const addAppointment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    let resultUploadImage = [];

    if (size(imagesSelected) > 0) {
      resultUploadImage = await uploadImages();
    }

    const appointmentInfo = {
      name: formData.name,
      dateAndTime: formData.dateAndTime,
      address: formData.address,
      location: locationAppointment,
      idPatient: formData.idPatient,
      namePatient: getNamePatientById(formData.idPatient),
      doctor: formData.doctor,
      idTags: formData.idTags,
      notes: formData.notes,
      createAt: new Date(),
      images: resultUploadImage,
      idCreator: getCurrentUser().uid,
    };

    const responseAddAppointment = await addDocumentWithoutId(
      "Appointments",
      appointmentInfo
    );
    setLoading(false);

    if (!responseAddAppointment.statusResponse) {
      toasRef.current.show(
        "Error al guardar la cita, intente nuevamente.",
        3000
      );
      return;
    }
    await syncAppointmentReminders();
    const patient = memberPatients.find(
      (item) => item.id === appointmentInfo.idPatient
    );
    const goList = () => navigation.navigate("appointments");
    const offered = askToSendAppointmentWhatsApp({
      patient,
      appointment: appointmentInfo,
      userTags,
      isUpdate: false,
      onFinish: goList,
    });
    if (!offered) {
      goList();
    }
  };

  saveRef.current = addAppointment;

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderSaveButton
          onPress={() => saveRef.current && saveRef.current()}
        />
      ),
    });
  }, [navigation]);

  const uploadImages = async () => {
    const imagesUrl = [];

    if (!Array.isArray(imagesSelected) || imagesSelected.length === 0) {
      throw new Error("No hay archivos seleccionados para subir");
    }

    await Promise.all(
      imagesSelected.map(async (item) => {
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
        } else {
          console.error("Error subiendo archivo:", response.error);
        }
      })
    );

    return imagesUrl;
  };

  const getNamePatientById = (idPatient) => {
    const name = memberPatients.filter((patient) => patient.id === idPatient);
    const namePatient = name.map((patient) => patient.name)[0];
    return namePatient;
  };

  const validateForm = () => {
    setErrorName(null);
    setErrorDateAndTime(null);
    setErrorAddress(null);
    setErrorDoctor(null);

    let isValidForm = true;

    if (isEmpty(formData.name)) {
      setErrorName("Ingresa por favor un nombre para la cita.");
      isValidForm = false;
    }
    if (!isDate(formData.dateAndTime)) {
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

  const openDatePicker = () => {
    const minDate = getSoonestAppointmentDate();
    const selected = formData.dateAndTime;
    setPickerDate(
      isDate(selected) && selected.getTime() > Date.now() ? selected : minDate
    );
    setDatePickerVisibility(true);
  };

  const handleConfirmDate = (datetime) => {
    setDatePickerVisibility(false);
    const minDate = getSoonestAppointmentDate();
    const safeDate =
      datetime && datetime.getTime() >= minDate.getTime() ? datetime : minDate;
    if (datetime && datetime.getTime() < minDate.getTime()) {
      toasRef.current.show(
        "La fecha y hora deben ser posteriores a la hora actual.",
        3000
      );
    }
    setField("dateAndTime", safeDate);
    setErrorDateAndTime(null);
  };

  const selectPatient = (patientId) => {
    setField("idPatient", patientId);
    setVisiblePatient(false);
  };

  const toggleTag = (tagId) => {
    let next = [...idTags];
    if (next.includes(tagId)) {
      next = next.filter((id) => id !== tagId);
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

  const dateLabel = isDate(formData.dateAndTime)
    ? moment(formData.dateAndTime).format("YYYY-MM-DD hh:mm A")
    : "";
  const patientName = getNamePatientById(formData.idPatient);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            onPress={openDatePicker}
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
            error={errorDoctor}
          >
            <TextInput
              style={styles.ginput}
              placeholder="Nombre del médico"
              placeholderTextColor={COLORS.placeholder}
              value={formData.doctor}
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
              value={formData.notes}
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

        <AppointmentDateTimePicker
          isVisible={isDatePickerVisible}
          date={pickerDate}
          minimumDate={getSoonestAppointmentDate()}
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <MapPickerModal
          isVisible={visibleMap}
          setVisible={setVisibleMap}
          initialLocation={locationAppointment}
          initialAddress={formData.address}
          toastRef={toasRef}
          onSave={(location, address) => {
            setLocationAppointment(location);
            setFormData((prev) => ({ ...prev, address }));
            setErrorAddress(null);
          }}
        />

        <PatientPickerModal
          isVisible={visiblePatient}
          setVisible={setVisiblePatient}
          patients={memberPatients}
          selectedId={formData.idPatient}
          onSelect={selectPatient}
        />

        <NewTagModal
          isVisible={visibleNewTag}
          setVisible={setVisibleNewTag}
          existingTags={userTags}
          onCreated={onTagCreated}
          toastRef={toasRef}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const defaultFormValues = () => {
  return {
    name: "",
    dateAndTime: "",
    address: "",
    idPatient: "",
    notes: "",
    doctor: "",
    idTags: "",
  };
}
