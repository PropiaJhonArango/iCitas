import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { COLORS } from "./appointmentFormUi";
import { pad2, SpinnerSheet, Wheel } from "./spinnerPicker";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export default function TimeSpinnerModal({
  isVisible,
  date,
  onConfirm,
  onCancel,
}) {
  const initial = useMemo(() => date || new Date(), [date, isVisible]);
  const [hour, setHour] = useState(initial.getHours());
  const [minute, setMinute] = useState(initial.getMinutes());

  useEffect(() => {
    if (isVisible) {
      const next = date || new Date();
      setHour(next.getHours());
      setMinute(next.getMinutes());
    }
  }, [isVisible, date]);

  const accept = () => {
    const next = new Date(date || new Date());
    next.setHours(hour, minute, 0, 0);
    onConfirm(next);
  };

  return (
    <SpinnerSheet
      visible={isVisible}
      title="Elige la hora"
      preview={`${pad2(hour)}:${pad2(minute)}`}
      onCancel={onCancel}
      onAccept={accept}
    >
      <Wheel values={HOURS} value={hour} onChange={setHour} />
      <Text style={styles.colon}>:</Text>
      <Wheel values={MINUTES} value={minute} onChange={setMinute} />
    </SpinnerSheet>
  );
}

const styles = StyleSheet.create({
  colon: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.header,
    marginHorizontal: 4,
    marginBottom: 4,
  },
});
