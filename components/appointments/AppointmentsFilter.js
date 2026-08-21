import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { size } from "lodash";

import Modal from "../Modal";
import { COLORS, tagsToArray, toJsDate } from "./appointmentFormUi";

export const emptyFilters = () => ({
  patient: null,
  date: null,
  place: "",
  tagId: null,
});

export function hasActiveFilters(filters) {
  return !!(
    filters.patient ||
    filters.date ||
    (filters.place && filters.place.trim()) ||
    filters.tagId
  );
}

export function applyAppointmentFilters(appointments, filters) {
  if (!hasActiveFilters(filters)) {
    return appointments;
  }

  const placeQuery = (filters.place || "").trim().toLowerCase();
  const dateKey = filters.date
    ? moment(filters.date).format("YYYY-MM-DD")
    : null;

  return appointments.filter((item) => {
    if (filters.patient && item.namePatient !== filters.patient) {
      return false;
    }

    if (dateKey) {
      const date = toJsDate(item.dateAndTime);
      if (!date || moment(date).format("YYYY-MM-DD") !== dateKey) {
        return false;
      }
    }

    if (placeQuery) {
      const address = (item.address || "").toLowerCase();
      if (!address.includes(placeQuery)) {
        return false;
      }
    }

    if (filters.tagId) {
      const ids = tagsToArray(item.idTags);
      if (!ids.includes(filters.tagId)) {
        return false;
      }
    }

    return true;
  });
}

export default function AppointmentsFilter({
  appointments,
  userTags,
  filters,
  onChange,
}) {
  const [visiblePatient, setVisiblePatient] = useState(false);
  const [visiblePlace, setVisiblePlace] = useState(false);
  const [visibleTag, setVisibleTag] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);
  const [placeDraft, setPlaceDraft] = useState("");

  const patients = useMemo(() => {
    const names = [
      ...new Set(
        appointments.map((item) => item.namePatient).filter((name) => !!name)
      ),
    ];
    names.sort((a, b) => a.localeCompare(b));
    return names;
  }, [appointments]);

  const setFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const openPlace = () => {
    setPlaceDraft(filters.place || "");
    setVisiblePlace(true);
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <FilterChip
          icon="user"
          label={filters.patient || "Paciente"}
          active={!!filters.patient}
          onPress={() => setVisiblePatient(true)}
          onClear={() => setFilter("patient", null)}
        />
        <FilterChip
          icon="calendar"
          label={
            filters.date
              ? moment(filters.date).format("YYYY-MM-DD")
              : "Fecha"
          }
          active={!!filters.date}
          onPress={() => setVisibleDate(true)}
          onClear={() => setFilter("date", null)}
        />
        <FilterChip
          icon="map-marker"
          label={
            filters.place && filters.place.trim()
              ? filters.place.trim()
              : "Lugar"
          }
          active={!!(filters.place && filters.place.trim())}
          onPress={openPlace}
          onClear={() => setFilter("place", "")}
        />
        <FilterChip
          icon="tag"
          label={
            userTags.find((tag) => tag.id === filters.tagId)?.tagName ||
            "Etiqueta"
          }
          active={!!filters.tagId}
          onPress={() => setVisibleTag(true)}
          onClear={() => setFilter("tagId", null)}
        />
      </ScrollView>

      {hasActiveFilters(filters) && (
        <TouchableOpacity
          onPress={() => onChange(emptyFilters())}
          style={styles.clearBtn}
        >
          <Text style={styles.clearText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}

      <Modal isVisible={visiblePatient} setVisible={setVisiblePatient}>
        <Text style={styles.modalTitle}>Filtrar por paciente</Text>
        <ScrollView style={styles.modalList}>
          {size(patients) === 0 ? (
            <Text style={styles.emptyText}>No hay pacientes en estas citas</Text>
          ) : (
            patients.map((name) => (
              <TouchableOpacity
                key={name}
                style={styles.optionRow}
                onPress={() => {
                  setFilter("patient", name);
                  setVisiblePatient(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.patient === name && styles.optionTextActive,
                  ]}
                >
                  {name}
                </Text>
                {filters.patient === name && (
                  <Icon
                    type="font-awesome"
                    name="check"
                    size={14}
                    color={COLORS.teal}
                  />
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Modal>

      <Modal isVisible={visiblePlace} setVisible={setVisiblePlace}>
        <Text style={styles.modalTitle}>Filtrar por lugar</Text>
        <TextInput
          style={styles.placeInput}
          placeholder="Clínica, barrio o dirección..."
          placeholderTextColor={COLORS.placeholder}
          value={placeDraft}
          onChangeText={setPlaceDraft}
          autoFocus
        />
        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => setVisiblePlace(false)}
          >
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalSave}
            onPress={() => {
              setFilter("place", placeDraft.trim());
              setVisiblePlace(false);
            }}
          >
            <Text style={styles.modalSaveText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={visibleTag} setVisible={setVisibleTag}>
        <Text style={styles.modalTitle}>Filtrar por etiqueta</Text>
        <ScrollView style={styles.modalList}>
          {size(userTags) === 0 ? (
            <Text style={styles.emptyText}>No hay etiquetas creadas</Text>
          ) : (
            userTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={styles.optionRow}
                onPress={() => {
                  setFilter("tagId", tag.id);
                  setVisibleTag(false);
                }}
              >
                <View
                  style={[
                    styles.tagDot,
                    { backgroundColor: tag.tagColor || COLORS.header },
                  ]}
                />
                <Text
                  style={[
                    styles.optionText,
                    filters.tagId === tag.id && styles.optionTextActive,
                  ]}
                >
                  {tag.tagName}
                </Text>
                {filters.tagId === tag.id && (
                  <Icon
                    type="font-awesome"
                    name="check"
                    size={14}
                    color={COLORS.teal}
                  />
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Modal>

      <DateTimePickerModal
        isVisible={visibleDate}
        mode="date"
        onConfirm={(selected) => {
          setVisibleDate(false);
          setFilter("date", selected);
        }}
        onCancel={() => setVisibleDate(false)}
      />
    </View>
  );
}

function FilterChip({ icon, label, active, onPress, onClear }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <TouchableOpacity
        style={styles.chipMain}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <Icon
          type="font-awesome"
          name={icon}
          size={12}
          color={active ? COLORS.teal : COLORS.mutedIcon}
        />
        <Text
          style={[styles.chipText, active && styles.chipTextActive]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
      {active && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            type="font-awesome"
            name="times-circle"
            size={14}
            color={COLORS.teal}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  row: {
    paddingHorizontal: 14,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    maxWidth: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.chipText,
    maxWidth: 140,
  },
  chipTextActive: {
    color: COLORS.chipActiveText,
  },
  clearBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.teal,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.value,
    marginBottom: 12,
    textAlign: "center",
  },
  modalList: {
    maxHeight: 320,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.label,
    paddingVertical: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: 8,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.value,
  },
  optionTextActive: {
    fontWeight: "700",
    color: COLORS.teal,
  },
  tagDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  placeInput: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.value,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingVertical: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  modalCancel: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.mutedIcon,
  },
  modalSave: {
    backgroundColor: COLORS.header,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  modalSaveText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
