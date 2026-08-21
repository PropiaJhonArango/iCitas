import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { isEmpty, map } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

import { addDocumentWithoutId, getCurrentUser } from "../../utils/actions";
import Modal from "../Modal";

export const COLORS = {
  bg: "#eceae6",
  header: "#357288",
  teal: "#2f7d96",
  blue: "#3a6ea5",
  red: "#e8503c",
  mutedIcon: "#7a8288",
  label: "#9aa4ac",
  placeholder: "#b6bcc2",
  value: "#3a4247",
  divider: "#f0f0ed",
  chipBg: "#eef1f4",
  chipText: "#5b6670",
  chipActiveBg: "#e7f0f3",
  chipActiveText: "#2f7d96",
  dashed: "#cfd5da",
  chevron: "#c2c8ce",
  white: "#FFFFFF",
};

export const TAG_COLORS = ["#f4544c", "#067da4", "#22af1b", "#f87c44"];

export const stackHeaderOptions = (title) => ({
  title,
  headerTitleStyle: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.2,
  },
  headerStyle: {
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 8,
    shadowColor: COLORS.header,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  headerTintColor: COLORS.white,
  headerTitleAlign: "center",
  headerRightContainerStyle: {
    paddingRight: 10,
  },
  cardStyle: {
    backgroundColor: COLORS.bg,
  },
});

export function ScreenHeader({ title }) {
  return (
    <View style={styles.headerWrap}>
      <SafeAreaView edges={["top"]}>
        <Text style={styles.headerTitle}>{title}</Text>
      </SafeAreaView>
    </View>
  );
}

export function tagsToArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return Object.values(value).filter(Boolean);
}

export function toJsDate(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value.toDate === "function") {
    return value.toDate();
  }
  return null;
}

export function FieldRow({
  iconName,
  iconColor,
  label,
  children,
  error,
  onPress,
  onIconPress,
  chevron,
  rightIcon,
  onRightPress,
  alignTop,
}) {
  const content = (
    <View style={[styles.grow, alignTop && styles.growTop]}>
      <TouchableOpacity
        style={styles.gic}
        onPress={onIconPress}
        disabled={!onIconPress}
        activeOpacity={onIconPress ? 0.7 : 1}
      >
        <Icon
          type="font-awesome"
          name={iconName}
          size={16}
          color={iconColor}
        />
      </TouchableOpacity>
      <View style={styles.gbody}>
        <Text style={styles.glab}>{label}</Text>
        {children}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      {chevron && (
        <Icon
          type="font-awesome"
          name="chevron-right"
          size={14}
          color={COLORS.chevron}
        />
      )}
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            type="font-awesome"
            name={rightIcon}
            size={16}
            color={COLORS.chevron}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export function HeaderSaveButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.hsave}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon
        type="font-awesome"
        name="floppy-o"
        size={14}
        color={COLORS.white}
      />
      <Text style={styles.hsaveText}>Guardar</Text>
    </TouchableOpacity>
  );
}

export function HeaderDeleteButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.hdelete}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon
        type="font-awesome"
        name="trash-o"
        size={16}
        color={COLORS.white}
      />
    </TouchableOpacity>
  );
}

export function TagChips({ tags, selectedIds, onToggle, onAdd }) {
  return (
    <View style={styles.chips}>
      {map(tags, (tag) => {
        const selected = selectedIds.includes(tag.id);
        return (
          <TouchableOpacity
            key={tag.id}
            style={[styles.chip, selected && styles.chipActive]}
            onPress={() => onToggle(tag.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, selected && styles.chipActiveText]}>
              {tag.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={[styles.chip, styles.chipAdd]}
        onPress={onAdd}
        activeOpacity={0.7}
      >
        <Text style={styles.chipAddText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export function PatientPickerModal({
  isVisible,
  setVisible,
  patients,
  selectedId,
  onSelect,
}) {
  return (
    <Modal isVisible={isVisible} setVisible={setVisible}>
      <Text style={styles.modalTitle}>Seleccionar paciente</Text>
      <ScrollView style={styles.patientList}>
        {map(patients, (patient) => {
          const selected = selectedId === patient.id;
          return (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientRow}
              onPress={() => onSelect(patient.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.patientName,
                  selected && styles.patientNameSelected,
                ]}
              >
                {patient.name}
              </Text>
              {selected && (
                <Icon
                  type="font-awesome"
                  name="check"
                  size={14}
                  color={COLORS.teal}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Modal>
  );
}

export function NewTagModal({
  isVisible,
  setVisible,
  existingTags,
  onCreated,
  toastRef,
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#067da4");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setName("");
      setColor("#067da4");
      setError(null);
    }
  }, [isVisible]);

  const reset = () => {
    setName("");
    setColor("#067da4");
    setError(null);
  };

  const close = () => {
    reset();
    setVisible(false);
  };

  const save = async () => {
    const trimmed = name.trim();
    if (isEmpty(trimmed)) {
      setError("Ingresa un nombre para la etiqueta.");
      return;
    }

    const alreadyExists = existingTags.some(
      (tag) => tag.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      setError("Ya existe una etiqueta con ese nombre.");
      return;
    }

    setSaving(true);
    const response = await addDocumentWithoutId("UserTags", {
      tagName: trimmed,
      tagColor: color,
      ownerId: getCurrentUser().uid,
      createdDate: new Date(),
    });
    setSaving(false);

    if (!response.statusResponse || !response.id) {
      toastRef.current.show(
        "Error al guardar la etiqueta, intente nuevamente.",
        3000
      );
      return;
    }

    onCreated({ id: response.id, name: trimmed });
    close();
  };

  return (
    <Modal isVisible={isVisible} setVisible={setVisible}>
      <Text style={styles.modalTitle}>Nueva etiqueta</Text>
      <Text style={styles.tagModalLabel}>NOMBRE</Text>
      <TextInput
        style={styles.tagModalInput}
        placeholder="Nombre de la etiqueta"
        placeholderTextColor={COLORS.placeholder}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError(null);
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Text style={[styles.tagModalLabel, { marginTop: 14 }]}>COLOR</Text>
      <View style={styles.tagColors}>
        {TAG_COLORS.map((itemColor) => (
          <TouchableOpacity
            key={itemColor}
            style={[
              styles.tagColorDot,
              { backgroundColor: itemColor },
              color === itemColor && styles.tagColorDotSelected,
            ]}
            onPress={() => setColor(itemColor)}
          />
        ))}
      </View>
      <View style={styles.tagModalActions}>
        <TouchableOpacity
          style={styles.tagModalCancel}
          onPress={close}
          disabled={saving}
        >
          <Text style={styles.tagModalCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tagModalSave, saving && { opacity: 0.6 }]}
          onPress={save}
          disabled={saving}
        >
          <Text style={styles.tagModalSaveText}>
            {saving ? "Guardando..." : "Crear"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingBottom: 16,
    alignItems: "center",
    shadowColor: COLORS.header,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.2,
    textAlign: "center",
    paddingTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 12,
  },
  group: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: "hidden",
  },
  grow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  growTop: {
    alignItems: "flex-start",
  },
  gic: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  gbody: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  glab: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLORS.label,
  },
  gph: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.placeholder,
  },
  gval: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.value,
  },
  ginput: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.value,
    padding: 0,
    margin: 0,
  },
  notesInput: {
    minHeight: 36,
  },
  gdiv: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 48,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.red,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hsave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 6,
    paddingLeft: 9,
    paddingRight: 11,
    borderRadius: 20,
  },
  hsaveText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12.5,
  },
  hdelete: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: COLORS.chipBg,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.chipText,
  },
  chipActiveText: {
    color: COLORS.chipActiveText,
  },
  chipAdd: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.dashed,
    paddingHorizontal: 8,
  },
  chipAddText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.label,
  },
  imgtiles: {
    marginTop: 6,
    flexGrow: 0,
  },
  imgadd: {
    width: 44,
    height: 44,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.dashed,
    borderStyle: "dashed",
    backgroundColor: "#f6f5f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  imgtile: {
    width: 44,
    height: 44,
    borderRadius: 11,
    marginRight: 9,
    backgroundColor: "#eef1f3",
  },
  pdfTile: {
    width: 44,
    height: 44,
    borderRadius: 11,
    marginRight: 9,
    backgroundColor: "#fdecea",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f5c4bf",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.value,
    marginBottom: 12,
    textAlign: "center",
  },
  patientList: {
    maxHeight: 320,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.value,
    flex: 1,
    marginRight: 8,
  },
  patientNameSelected: {
    fontWeight: "700",
    color: COLORS.teal,
  },
  tagModalLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: COLORS.label,
    marginBottom: 6,
  },
  tagModalInput: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.value,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  tagColors: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tagColorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  tagColorDotSelected: {
    borderWidth: 3,
    borderColor: COLORS.value,
  },
  tagModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  tagModalCancel: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tagModalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.mutedIcon,
  },
  tagModalSave: {
    backgroundColor: COLORS.header,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  tagModalSaveText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  headerButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
