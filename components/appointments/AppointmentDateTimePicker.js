import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import TimeSpinnerModal from "./TimeSpinnerModal";
import DateSpinnerModal from "./DateSpinnerModal";

const ANDROID_SWITCH_MS = 350;

function mergeDateAndTime(day, time) {
  const next = new Date(day);
  next.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return next;
}

export default function AppointmentDateTimePicker({
  isVisible,
  date,
  minimumDate,
  onConfirm,
  onCancel,
}) {
  const [step, setStep] = useState("date");
  const [draft, setDraft] = useState(date || new Date());

  useEffect(() => {
    if (isVisible) {
      setStep("date");
      setDraft(date || new Date());
    }
  }, [isVisible, date]);

  if (Platform.OS === "ios") {
    return (
      <DateTimePickerModal
        isVisible={isVisible}
        mode="datetime"
        display="spinner"
        date={date || new Date()}
        minimumDate={minimumDate}
        is24Hour={true}
        locale="es-CO"
        confirmTextIOS="Listo"
        cancelTextIOS="Cancelar"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
  }

  const handleConfirmDate = (picked) => {
    const next = mergeDateAndTime(picked, draft);
    setDraft(next);
    setStep("hidden");
    setTimeout(() => setStep("time"), ANDROID_SWITCH_MS);
  };

  const handleConfirmTime = (picked) => {
    onConfirm(mergeDateAndTime(draft, picked));
  };

  const handleCancel = () => {
    setStep("date");
    onCancel();
  };

  return (
    <>
      <DateSpinnerModal
        isVisible={isVisible && step === "date"}
        date={draft}
        minimumDate={minimumDate}
        onConfirm={handleConfirmDate}
        onCancel={handleCancel}
      />
      <TimeSpinnerModal
        isVisible={isVisible && step === "time"}
        date={draft}
        onConfirm={handleConfirmTime}
        onCancel={handleCancel}
      />
    </>
  );
}
