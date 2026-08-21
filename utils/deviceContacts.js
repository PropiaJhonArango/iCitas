import { Alert, Linking, Platform } from "react-native";
import * as Contacts from "expo-contacts";
import {
  getCallingCodeFromCountryCode,
  parsePhoneForMember,
} from "./helpers";

const uniquePhones = (phoneNumbers = []) => {
  const seen = new Set();
  return phoneNumbers.filter((item) => {
    const raw = item?.number || item?.digits || "";
    const key = String(raw).replace(/\D/g, "");
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const getContactDisplayName = (contact = {}) => {
  const full = String(contact.name || "").trim();
  if (full) {
    return full;
  }
  return [contact.firstName, contact.middleName, contact.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
};

export const mapPhoneToMember = (phone, fallbackCallingCode = "57") => {
  const raw = phone?.digits || phone?.number || "";
  const fromIso = getCallingCodeFromCountryCode(phone?.countryCode);
  if (fromIso) {
    const parsed = parsePhoneForMember(raw, fromIso);
    return {
      callingCode: fromIso,
      phoneNumber: parsed.phoneNumber,
    };
  }
  return parsePhoneForMember(raw, fallbackCallingCode);
};

export const mapContactToMember = (contact, fallbackCallingCode = "57") => {
  const name = getContactDisplayName(contact);
  const phones = uniquePhones(contact.phoneNumbers);
  if (!phones.length) {
    return {
      name,
      callingCode: fallbackCallingCode,
      phoneNumber: "",
      noPhone: true,
      phones: [],
    };
  }

  const mobile =
    phones.find((item) =>
      /mobile|m[oó]vil|celu|cell|iphone/i.test(item.label || "")
    ) || phones[0];

  return {
    name,
    ...mapPhoneToMember(mobile, fallbackCallingCode),
    noPhone: false,
    phones,
  };
};

export const ensureContactsPermission = async () => {
  const current = await Contacts.getPermissionsAsync();
  let status = current.status;

  if (status !== "granted") {
    const requested = await Contacts.requestPermissionsAsync();
    status = requested.status;
  }

  if (status === "granted") {
    return true;
  }

  Alert.alert(
    "Permiso de contactos",
    "Para elegir un integrante desde tu agenda, autoriza el acceso a los contactos.",
    [
      { text: "Ahora no", style: "cancel" },
      { text: "Abrir ajustes", onPress: () => Linking.openSettings() },
    ]
  );
  return false;
};

export const pickNativeContact = async () => {
  if (typeof Contacts.presentContactPickerAsync !== "function") {
    return { status: false, needsList: true };
  }

  try {
    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) {
      return { status: false, cancelled: true };
    }
    return { status: true, contact };
  } catch (error) {
    return { status: false, needsList: true, error };
  }
};

export const loadDeviceContacts = async () => {
  const contacts = [];
  let pageOffset = 0;
  const pageSize = 300;
  let hasNextPage = true;

  while (hasNextPage) {
    const result = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
      sort:
        Platform.OS === "ios"
          ? Contacts.SortTypes.FirstName
          : Contacts.SortTypes.UserDefault,
      pageSize,
      pageOffset,
    });
    contacts.push(...(result.data || []));
    hasNextPage = Boolean(result.hasNextPage);
    pageOffset += pageSize;
    if (pageOffset > 15000) {
      break;
    }
  }

  return contacts
    .map((contact) => ({
      id: contact.id,
      name: getContactDisplayName(contact) || "Sin nombre",
      phoneNumbers: uniquePhones(contact.phoneNumbers),
    }))
    .filter((contact) => contact.name || contact.phoneNumbers.length)
    .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
};
