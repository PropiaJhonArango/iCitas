import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { map } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getCurrentUser,
  uploadImage,
  updateUserProfile,
  closeSession,
  updateDocument,
  getCollectionWithId,
  getAppointmentsCounts,
} from "../../utils/actions";
import { loadImageFromGallery } from "../../utils/helpers";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import DisplayDataForm from "../../components/profile/DisplayDataForm";
import { COLORS } from "../../components/appointments/appointmentFormUi";

export default function UserLogged({ setLogged }) {
  const [user, setUser] = useState();
  const [reloadUser, setReloadUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    setUser(getCurrentUser());
    setReloadUser(false);
  }, [reloadUser]);

  if (!user) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Header
          user={user}
          setLoading={setLoading}
          setLoadingText={setLoadingText}
        />
        <AppointmentsStats user={user} />
        <PersonalInfo
          user={user}
          setUser={setUser}
          setReloadUser={setReloadUser}
        />
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await closeSession();
            setLogged(false);
          }}
        >
          <Icon
            type="font-awesome"
            name="sign-out"
            size={16}
            color={COLORS.red}
          />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <Loading isVisible={loading} text={loadingText} />
      </ScrollView>
    </View>
  );
}

function Header({ user, setLoading, setLoadingText }) {
  const [photoUrl, setPhotoUrl] = useState(user.photoURL);

  const updateProfilePhoto = async () => {
    const resultImageSelected = await loadImageFromGallery([1, 1]);
    if (!resultImageSelected.status) {
      return;
    }

    setLoadingText("Actualizando foto de perfil.");
    setLoading(true);
    const resultUploadImage = await uploadImage(
      resultImageSelected.image,
      "avatars",
      user.uid
    );

    if (!resultUploadImage.statusResponse) {
      setLoading(false);
      Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.");
      return;
    }

    const resultUpdateProfile = await updateUserProfile({
      photoURL: resultUploadImage.url,
    });

    await updateDocument("Users", user.uid, {
      photoURL: resultUploadImage.url,
    });

    setLoading(false);
    if (resultUpdateProfile.statusResponse) {
      setPhotoUrl(resultUploadImage.url);
    } else {
      Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.");
    }
  };

  return (
    <View style={styles.headerWrap}>
      <SafeAreaView edges={["top"]}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity
          style={styles.photoWrap}
          onPress={updateProfilePhoto}
          activeOpacity={0.8}
        >
          <Image
            source={
              photoUrl
                ? { uri: photoUrl }
                : require("../../assets/avatar-default.jpg")
            }
            style={styles.profilePhoto}
          />
          <View style={styles.cameraBtn}>
            <Icon
              type="font-awesome"
              name="camera"
              size={14}
              color={COLORS.header}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.titleName}>
          {user.displayName ? user.displayName : "Anónimo"}
        </Text>
      </SafeAreaView>
    </View>
  );
}

function PersonalInfo({ user, setUser, setReloadUser }) {
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [renderComponentInfo, setRenderComponentInfo] = useState(null);
  const [infoUser, setInfoUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadInfoExternal, setReloadInfoExternal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const result = await getCollectionWithId("Users", user.uid);

        if (!result.statusResponse) {
          setLoading(false);
          return;
        }

        setUser({
          ...user,
          numberIdentify: result.data.numberIdentify,
          phoneNumberUser: result.data.phoneNumber,
          callingCode: result.data.callingCode,
        });
        setInfoUser({
          numberIdentify: result.data.numberIdentify,
          phoneNumberUser: result.data.phoneNumber,
          callingCode: result.data.callingCode,
        });
        setReloadInfoExternal(false);
        setLoading(false);
      })();
    }, [reloadInfoExternal])
  );

  const dataOptionsUser = () => {
    return [
      {
        iconName: "user-circle",
        iconColor: COLORS.blue,
        label: "Nombre",
        textData: user.displayName ? user.displayName : "Nombre completo",
        onPress: () => selectedField("displayName"),
      },
      {
        iconName: "id-badge",
        iconColor: COLORS.blue,
        label: "Identificación",
        textData: user.numberIdentify
          ? user.numberIdentify
          : infoUser.numberIdentify
          ? infoUser.numberIdentify
          : "Número de identificación",
        onPress: () => selectedField("numberIdentify"),
      },
      {
        iconName: "envelope",
        iconColor: COLORS.teal,
        label: "Correo",
        textData: user.email ? user.email : "Correo electrónico",
        onPress: () => selectedField("email"),
      },
      {
        iconName: "phone",
        iconColor: COLORS.teal,
        label: "Teléfono",
        textData:
          user.callingCode || infoUser.callingCode
            ? "+" +
              (user.callingCode || infoUser.callingCode) +
              " " +
              (user.phoneNumberUser || infoUser.phoneNumberUser || "")
            : "Número telefónico",
        onPress: () => selectedField("phoneNumber"),
      },
      {
        iconName: "lock",
        iconColor: COLORS.mutedIcon,
        label: "Seguridad",
        textData: "Cambiar contraseña",
        onPress: () => selectedField("password"),
      },
    ];
  };

  const selectedField = (key) => {
    const common = {
      typeField: key,
      setReloadUser,
      setShowModalInfo,
      uidUser: user.uid,
      setReloadInfoExternal,
    };

    switch (key) {
      case "displayName":
        setRenderComponentInfo(
          <DisplayDataForm {...common} valueField={user.displayName} />
        );
        break;
      case "numberIdentify":
        setRenderComponentInfo(
          <DisplayDataForm {...common} valueField={user.numberIdentify} />
        );
        break;
      case "email":
        setRenderComponentInfo(
          <DisplayDataForm {...common} valueField={user.email} />
        );
        break;
      case "phoneNumber":
        setRenderComponentInfo(
          <DisplayDataForm
            {...common}
            valueField={
              user.callingCode && user.callingCode + "_" + user.phoneNumberUser
            }
          />
        );
        break;
      case "password":
        setRenderComponentInfo(<DisplayDataForm {...common} valueField={""} />);
        break;
    }
    setShowModalInfo(true);
  };

  const menuData = dataOptionsUser();

  return (
    <View style={styles.group}>
      {map(menuData, (menu, index) => (
        <View key={index}>
          {index > 0 && <View style={styles.divider} />}
          <TouchableOpacity onPress={menu.onPress} activeOpacity={0.7}>
            <View style={styles.infoRow}>
              <Icon
                type="font-awesome"
                name={menu.iconName}
                size={16}
                color={menu.iconColor}
              />
              <View style={styles.infoBody}>
                <Text style={styles.infoLabel}>{menu.label}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {menu.textData}
                </Text>
              </View>
              <Icon
                type="font-awesome"
                name="chevron-right"
                size={14}
                color={COLORS.chevron}
              />
            </View>
          </TouchableOpacity>
        </View>
      ))}
      <Modal isVisible={showModalInfo} setVisible={setShowModalInfo}>
        {renderComponentInfo}
      </Modal>
      <Loading isVisible={loading} text="Cargando..." />
    </View>
  );
}

function AppointmentsStats({ user }) {
  const [pending, setPending] = useState(0);
  const [expired, setExpired] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function loadCounts() {
        if (!user?.uid) {
          return;
        }
        const response = await getAppointmentsCounts(user.uid);
        if (response.statusResponse) {
          setPending(response.pending);
          setExpired(response.expired);
        }
      }
      loadCounts();
    }, [user?.uid])
  );

  return (
    <View style={styles.statsCard}>
      <View style={[styles.statBlock, styles.statDivider]}>
        <Text style={styles.statNumber}>{pending}</Text>
        <Text style={styles.stat}>Citas pendientes</Text>
      </View>
      <View style={styles.statBlock}>
        <Text style={styles.statNumber}>{expired}</Text>
        <Text style={styles.stat}>Citas antiguas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  body: {
    paddingBottom: 28,
  },
  headerWrap: {
    backgroundColor: COLORS.header,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingBottom: 22,
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
    marginBottom: 14,
  },
  photoWrap: {
    alignSelf: "center",
  },
  profilePhoto: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
  },
  cameraBtn: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  titleName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  statsCard: {
    marginTop: -16,
    marginHorizontal: 14,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flexDirection: "row",
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: COLORS.divider,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.header,
  },
  stat: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLORS.label,
    marginTop: 4,
  },
  group: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 14,
    marginTop: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 48,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  infoBody: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: COLORS.label,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.value,
    marginTop: 1,
  },
  logoutBtn: {
    marginTop: 16,
    marginHorizontal: 14,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: COLORS.red,
    fontWeight: "700",
    fontSize: 15,
  },
});
