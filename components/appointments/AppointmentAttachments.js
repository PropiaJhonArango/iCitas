import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import ImageViewer from "react-native-image-zoom-viewer";
import { WebView } from "react-native-webview";
import { filter, map, size } from "lodash";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { SafeAreaView } from "react-native-safe-area-context";

import Loading from "../Loading";
import {
  ATTACHMENT_PDF,
  getAttachmentType,
  getAttachmentUri,
  loadAppointmentAttachment,
  openPdfWithSystemApp,
} from "../../utils/helpers";
import { COLORS, styles as formStyles } from "./appointmentFormUi";

export default function AppointmentAttachments({
  attachments,
  setAttachments,
  maxCount = 10,
}) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerMode, setViewerMode] = useState("image");
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [pdfUri, setPdfUri] = useState(null);
  const [viewerKey, setViewerKey] = useState(0);
  const [openingPdf, setOpeningPdf] = useState(false);

  const imageItems = attachments.filter(
    (item) => getAttachmentType(item) !== ATTACHMENT_PDF
  );
  const imageUrls = imageItems.map((item) => ({
    url: getAttachmentUri(item),
  }));

  const addAttachment = async () => {
    const response = await loadAppointmentAttachment();
    if (!response.status || !response.attachment) {
      return;
    }
    setAttachments([...attachments, response.attachment]);
  };

  const removeAttachment = (item) => {
    const uri = getAttachmentUri(item);
    Alert.alert(
      "Eliminar archivo",
      "¿Estás seguro de eliminar este archivo?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: () => {
            setAttachments(
              filter(attachments, (current) => getAttachmentUri(current) !== uri)
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const closeViewer = () => {
    setViewerVisible(false);
    setViewerReady(false);
    setPdfUri(null);
  };

  const openAttachment = async (item, index) => {
    if (getAttachmentType(item) === ATTACHMENT_PDF) {
      const uri = getAttachmentUri(item);
      if (Platform.OS === "android") {
        setOpeningPdf(true);
        const result = await openPdfWithSystemApp(uri);
        setOpeningPdf(false);
        if (!result.status) {
          Alert.alert(
            "No se pudo abrir el PDF",
            "Instala una app para ver PDFs (Drive, Adobe Reader, etc.) e inténtalo de nuevo."
          );
        }
        return;
      }
      setViewerMode("pdf");
      setPdfUri(uri);
      setViewerReady(false);
      setViewerVisible(true);
      return;
    }

    const uri = getAttachmentUri(attachments[index]);
    const nextIndex = imageItems.findIndex(
      (current) => getAttachmentUri(current) === uri
    );
    setViewerMode("image");
    setImageViewerIndex(nextIndex >= 0 ? nextIndex : 0);
    setViewerKey((key) => key + 1);
    setViewerReady(false);
    setViewerVisible(true);
  };

  const saveCurrentFile = async () => {
    try {
      if (viewerMode === "pdf") {
        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert("Aviso", "No se puede compartir el PDF en este dispositivo.");
          return;
        }
        let localUri = pdfUri;
        if (pdfUri && (pdfUri.startsWith("http://") || pdfUri.startsWith("https://"))) {
          const dest = FileSystem.cacheDirectory + `cita-adjunto-${Date.now()}.pdf`;
          const downloaded = await FileSystem.downloadAsync(pdfUri, dest);
          localUri = downloaded.uri;
        }
        await Sharing.shareAsync(localUri, {
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
        });
        return;
      }

      const current = imageItems[imageViewerIndex];
      const imageUrl = getAttachmentUri(current);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "No se puede guardar la imagen sin permisos."
        );
        return;
      }

      let localUri = imageUrl;
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        const dest =
          FileSystem.documentDirectory + `cita-imagen-${Date.now()}.jpg`;
        const downloaded = await FileSystem.downloadAsync(imageUrl, dest);
        localUri = downloaded.uri;
      }
      await MediaLibrary.createAssetAsync(localUri);
      Alert.alert("Imagen guardada", "La imagen se ha guardado en la galería.");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el archivo.");
      console.error("Error al guardar adjunto:", error);
    }
  };

  return (
    <>
      <ScrollView
        horizontal
        style={formStyles.imgtiles}
        showsHorizontalScrollIndicator={false}
      >
        {size(attachments) < maxCount && (
          <TouchableOpacity style={formStyles.imgadd} onPress={addAttachment}>
            <Icon
              type="font-awesome"
              name="plus"
              size={16}
              color={COLORS.label}
            />
          </TouchableOpacity>
        )}
        {map(attachments, (item, index) => {
          const uri = getAttachmentUri(item);
          const isPdf = getAttachmentType(item) === ATTACHMENT_PDF;
          return (
            <TouchableOpacity
              key={`${uri}-${index}`}
              onPress={() => openAttachment(item, index)}
              onLongPress={() => removeAttachment(item)}
              activeOpacity={0.8}
            >
              {isPdf ? (
                <View style={formStyles.pdfTile}>
                  <Icon
                    type="font-awesome"
                    name="file-pdf-o"
                    size={18}
                    color={COLORS.red}
                  />
                </View>
              ) : (
                <Image source={{ uri }} style={formStyles.imgtile} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Loading isVisible={openingPdf} text="Abriendo PDF..." />

      <Modal
        isVisible={viewerVisible}
        style={viewerStyles.modal}
        onBackdropPress={closeViewer}
        onBackButtonPress={closeViewer}
        onModalShow={() => {
          requestAnimationFrame(() => setViewerReady(true));
        }}
        onModalHide={() => setViewerReady(false)}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={1}
      >
        <SafeAreaView style={viewerStyles.container} edges={["top"]}>
          <View style={viewerStyles.header}>
            <TouchableOpacity
              onPress={saveCurrentFile}
              style={viewerStyles.headerButton}
            >
              <Icon name="download" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeViewer}
              style={viewerStyles.headerButton}
            >
              <Icon name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={viewerStyles.imageWrap}>
            {!viewerReady ? (
              <View style={viewerStyles.loader}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : viewerMode === "pdf" ? (
              <WebView
                source={{ uri: pdfUri }}
                style={viewerStyles.pdfView}
                originWhitelist={["*"]}
                allowFileAccess
                allowFileAccessFromFileURLs
                allowingReadAccessToURL={pdfUri}
                startInLoadingState
                renderLoading={() => (
                  <View style={viewerStyles.loader}>
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                )}
              />
            ) : (
              <ImageViewer
                key={viewerKey}
                imageUrls={imageUrls}
                index={imageViewerIndex}
                onChange={(nextIndex) => {
                  if (typeof nextIndex === "number") {
                    setImageViewerIndex(nextIndex);
                  }
                }}
                saveToLocalByLongPress={false}
                enableSwipeDown
                onSwipeDown={closeViewer}
                backgroundColor="#000"
                renderIndicator={(currentIndex, allSize) => (
                  <View style={viewerStyles.indicator} pointerEvents="none">
                    <Text style={viewerStyles.indicatorText}>
                      {currentIndex} / {allSize}
                    </Text>
                  </View>
                )}
                loadingRender={() => (
                  <View style={viewerStyles.loader}>
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                )}
                useNativeDriver
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const viewerStyles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 6,
    zIndex: 2,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  pdfView: {
    flex: 1,
    backgroundColor: "#000",
  },
  imageWrap: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 12,
    width: "100%",
    alignItems: "center",
  },
  indicatorText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
