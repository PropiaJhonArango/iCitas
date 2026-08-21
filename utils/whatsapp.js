import { Alert, Linking } from "react-native";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

function tagsToArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return Object.values(value).filter(Boolean);
}

export function getPatientWhatsAppNumber(patient) {
  if (!patient) {
    return null;
  }
  const code = String(patient.callingCode || "").replace(/\D/g, "");
  const phone = String(patient.phoneNumber || "").replace(/\D/g, "");
  if (!phone) {
    return null;
  }
  const full = code && !phone.startsWith(code) ? `${code}${phone}` : phone;
  return full.length >= 10 ? full : null;
}

export function tagNamesFromIds(idTags, userTags) {
  return tagsToArray(idTags)
    .map((id) => {
      const tag = (userTags || []).find((item) => item.id === id);
      return tag?.name || tag?.tagName;
    })
    .filter(Boolean);
}

export function buildAppointmentWhatsAppMessage({
  patientName,
  appointmentName,
  dateAndTime,
  address,
  doctor,
  tagNames,
  notes,
  isUpdate,
}) {
  const when = dateAndTime
    ? moment(dateAndTime).format("dddd D [de] MMMM [de] YYYY, h:mm a")
    : "Por confirmar";
  const tags = (tagNames || []).filter(Boolean).join(", ");
  const greetingName = (patientName || "paciente")
    .replace(/^Yo \(/, "")
    .replace(/\)$/, "");
  const lines = [
    isUpdate
      ? `Hola ${greetingName}, te actualizaron una cita en iCitas:`
      : `Hola ${greetingName}, te asignaron una cita en iCitas:`,
    "",
    `🩺 *Cita:* ${appointmentName || "Sin nombre"}`,
    "",
    `📅 *Fecha y hora:* ${when}`,
  ];
  if (address) {
    lines.push("", `🏥 *Lugar:* ${address}`);
  }
  if (doctor) {
    lines.push("", `👨‍⚕️ *Médico:* ${doctor}`);
  }
  if (tags) {
    lines.push("", `🏷️ *Etiquetas:* ${tags}`);
  }
  if (notes) {
    lines.push("", `📝 *Notas:* ${notes}`);
  }
  return lines.join("\n");
}

export async function openWhatsAppMessage(phone, text) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  try {
    await Linking.openURL(url);
    return { statusResponse: true };
  } catch (error) {
    return {
      statusResponse: false,
      error: "No se pudo abrir WhatsApp. Verifica que esté instalado.",
    };
  }
}

export function askToSendAppointmentWhatsApp({
  patient,
  appointment,
  userTags,
  isUpdate,
  onFinish,
}) {
  const phone = getPatientWhatsAppNumber(patient);
  if (!phone) {
    onFinish && onFinish();
    return false;
  }

  const message = buildAppointmentWhatsAppMessage({
    patientName: patient.name,
    appointmentName: appointment.name,
    dateAndTime: appointment.dateAndTime,
    address: appointment.address,
    doctor: appointment.doctor,
    tagNames: tagNamesFromIds(appointment.idTags, userTags),
    notes: appointment.notes,
    isUpdate,
  });

  let finished = false;
  const finish = () => {
    if (finished) {
      return;
    }
    finished = true;
    onFinish && onFinish();
  };

  Alert.alert(
    "Enviar por WhatsApp",
    `¿Quieres enviar los datos de la cita a ${patient.name} por WhatsApp?`,
    [
      {
        text: "Ahora no",
        style: "cancel",
        onPress: finish,
      },
      {
        text: "Enviar",
        onPress: async () => {
          const result = await openWhatsAppMessage(phone, message);
          if (!result.statusResponse) {
            Alert.alert("WhatsApp", result.error);
          }
          finish();
        },
      },
    ],
    { cancelable: true, onDismiss: finish }
  );
  return true;
}
