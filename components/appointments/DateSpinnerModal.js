import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import "moment/locale/es";

import { SpinnerSheet, Wheel } from "./spinnerPicker";

moment.locale("es");

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function yearRange(date, minimumDate) {
  const selectedYear = (date || new Date()).getFullYear();
  const minYear = (minimumDate || new Date()).getFullYear();
  const start = Math.min(selectedYear, minYear);
  const end = Math.max(selectedYear, minYear) + 8;
  const years = [];
  for (let year = start; year <= end; year += 1) {
    years.push(year);
  }
  return years;
}

export default function DateSpinnerModal({
  isVisible,
  date,
  minimumDate,
  onConfirm,
  onCancel,
}) {
  const initial = useMemo(() => date || new Date(), [date, isVisible]);
  const [day, setDay] = useState(initial.getDate());
  const [month, setMonth] = useState(initial.getMonth());
  const [year, setYear] = useState(initial.getFullYear());

  useEffect(() => {
    if (isVisible) {
      const next = date || new Date();
      setDay(next.getDate());
      setMonth(next.getMonth());
      setYear(next.getFullYear());
    }
  }, [isVisible, date]);

  const years = useMemo(
    () => yearRange(date, minimumDate),
    [date, minimumDate]
  );
  const maxDay = daysInMonth(year, month);
  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay]
  );

  useEffect(() => {
    if (day > maxDay) {
      setDay(maxDay);
    }
  }, [day, maxDay]);

  const previewDate = useMemo(() => {
    const safeDay = Math.min(day, maxDay);
    return new Date(year, month, safeDay);
  }, [day, month, year, maxDay]);

  const accept = () => {
    const next = new Date(date || new Date());
    next.setFullYear(year, month, Math.min(day, maxDay));
    onConfirm(next);
  };

  return (
    <SpinnerSheet
      visible={isVisible}
      title="Elige el día"
      preview={moment(previewDate).format("dddd D [de] MMMM YYYY")}
      onCancel={onCancel}
      onAccept={accept}
    >
      <Wheel values={days} value={Math.min(day, maxDay)} onChange={setDay} width={64} />
      <Wheel
        values={MONTHS}
        value={month}
        onChange={setMonth}
        formatLabel={(item) => MONTH_LABELS[item]}
        width={78}
      />
      <Wheel values={years} value={year} onChange={setYear} formatLabel={String} width={84} />
    </SpinnerSheet>
  );
}
