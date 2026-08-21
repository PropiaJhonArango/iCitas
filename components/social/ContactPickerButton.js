import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ensureContactsPermission,
  loadDeviceContacts,
  mapContactToMember,
  mapPhoneToMember,
  pickNativeContact,
} from "../../utils/deviceContacts";
import { COLORS } from "../appointments/appointmentFormUi";

export default function ContactPickerButton({
  callingCode = "57",
  onPicked,
  toastRef,
}) {
  const [listVisible, setListVisible] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [phoneChoices, setPhoneChoices] = useState(null);

  const filteredContacts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return contacts;
    }
    return contacts.filter((contact) => {
      const phones = contact.phoneNumbers
        .map((item) => item.number || item.digits || "")
        .join(" ");
      return `${contact.name} ${phones}`.toLowerCase().includes(term);
    });
  }, [contacts, query]);

  const deliverContact = (contact, selectedPhone) => {
    const mapped = mapContactToMember(contact, callingCode);
    const phone = selectedPhone
      ? mapPhoneToMember(selectedPhone, callingCode)
      : mapped;
    onPicked({
      name: mapped.name,
      callingCode: phone.callingCode,
      phoneNumber: phone.phoneNumber,
      noPhone: !phone.phoneNumber,
    });
    if (!phone.phoneNumber && toastRef?.current) {
      toastRef.current.show(
        "Ese contacto no tiene teléfono. Complétalo a mano.",
        3000
      );
    }
  };

  const resolvePhones = (contact) => {
    const mapped = mapContactToMember(contact, callingCode);
    if (mapped.phones.length > 1) {
      setPhoneChoices({
        name: mapped.name,
        phones: mapped.phones,
        contact,
      });
      return;
    }
    deliverContact(contact);
  };

  const openList = async () => {
    setListVisible(true);
    setLoadingList(true);
    setQuery("");
    try {
      const data = await loadDeviceContacts();
      setContacts(data);
    } catch (error) {
      setListVisible(false);
      toastRef?.current?.show(
        "No se pudieron cargar los contactos del celular.",
        3000
      );
    } finally {
      setLoadingList(false);
    }
  };

  const pickFromPhone = async () => {
    const allowed = await ensureContactsPermission();
    if (!allowed) {
      return;
    }

    const result = await pickNativeContact();
    if (result.cancelled) {
      return;
    }
    if (result.status && result.contact) {
      resolvePhones(result.contact);
      return;
    }
    await openList();
  };

  const closeList = () => {
    setListVisible(false);
    setQuery("");
    setPhoneChoices(null);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={pickFromPhone}
        activeOpacity={0.8}
      >
        <View style={styles.iconWrap}>
          <Icon
            type="font-awesome"
            name="address-book"
            size={16}
            color={COLORS.header}
          />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>Elegir de contactos</Text>
          <Text style={styles.hint}>
            Rellena nombre y teléfono desde tu agenda
          </Text>
        </View>
        <Icon
          type="font-awesome"
          name="chevron-right"
          size={14}
          color={COLORS.chevron}
        />
      </TouchableOpacity>

      <Modal
        visible={listVisible}
        animationType="slide"
        onRequestClose={closeList}
      >
        <SafeAreaView style={styles.modal} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Contactos</Text>
            <TouchableOpacity onPress={closeList} hitSlop={8}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.search}
            placeholder="Buscar por nombre o número..."
            placeholderTextColor={COLORS.placeholder}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {loadingList ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={COLORS.header} />
              <Text style={styles.loadingText}>Cargando contactos...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={(item, index) => item.id || `${item.name}-${index}`}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={
                filteredContacts.length === 0 ? styles.emptyList : undefined
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No se encontraron contactos.
                </Text>
              }
              renderItem={({ item }) => {
                const firstPhone =
                  item.phoneNumbers[0]?.number ||
                  item.phoneNumbers[0]?.digits ||
                  "Sin teléfono";
                return (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      closeList();
                      resolvePhones(item);
                    }}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {(item.name || "?").slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.texts}>
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactPhone}>{firstPhone}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </SafeAreaView>
      </Modal>

      <Modal
        visible={Boolean(phoneChoices)}
        transparent
        animationType="fade"
        onRequestClose={() => setPhoneChoices(null)}
      >
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>¿Cuál teléfono usar?</Text>
            <Text style={styles.sheetName}>{phoneChoices?.name}</Text>
            {(phoneChoices?.phones || []).map((phone, index) => (
              <TouchableOpacity
                key={`${phone.number}-${index}`}
                style={styles.sheetRow}
                onPress={() => {
                  const contact = phoneChoices.contact;
                  setPhoneChoices(null);
                  deliverContact(contact, phone);
                }}
              >
                <Text style={styles.sheetLabel}>
                  {phone.label || "Teléfono"}
                </Text>
                <Text style={styles.sheetNumber}>
                  {phone.number || phone.digits}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.sheetCancel}
              onPress={() => setPhoneChoices(null)}
            >
              <Text style={styles.sheetCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.chipActiveBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.value,
  },
  hint: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.label,
  },
  modal: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.header,
  },
  closeText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.teal,
  },
  search: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.value,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.label,
    fontWeight: "600",
  },
  emptyList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: COLORS.label,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.chipBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontWeight: "800",
    color: COLORS.header,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.value,
  },
  contactPhone: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.label,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.value,
  },
  sheetName: {
    marginTop: 4,
    marginBottom: 10,
    color: COLORS.label,
  },
  sheetRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  sheetLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.label,
    textTransform: "uppercase",
  },
  sheetNumber: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.value,
  },
  sheetCancel: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 10,
  },
  sheetCancelText: {
    fontWeight: "700",
    color: COLORS.red,
  },
});
