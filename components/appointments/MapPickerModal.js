import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import uuid from "random-uuid-v4";

import { googlePlacesApiKey } from "../../utils/firebase";
import { getCurrentLocation } from "../../utils/helpers";
import { COLORS } from "./appointmentFormUi";

/*
 * Selector de ubicación compartido (crear y editar cita).
 *
 * El autocompletado se consulta directo a la Places API con fetch (sin librería
 * externa) para tener control total del costo y de los gestos en Android.
 *
 * Control de costo de la Places API:
 *  - Session token (UUID) que viaja en Autocomplete y en Place Details, y se
 *    REGENERA tras cada selección: toda la sesión se factura como una sola.
 *  - debounce de 500 ms + mínimo 3 caracteres: no se pide por cada letra.
 *  - Place Details con fields = "geometry,name,formatted_address" (Basic Data).
 *    Nunca se piden campos de Contact ni Atmosphere.
 *  - El pin arrastrable usa el geocodificador del teléfono (expo-location),
 *    que es gratis y no consume la Places API.
 */

const AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const MIN_CHARS = 3;
const DEBOUNCE_MS = 500;

function buildPlaceLabel({ description, name, formattedAddress }) {
  const suggestion = (description || "").trim();
  if (suggestion) {
    return suggestion;
  }
  const formatted = (formattedAddress || "").trim();
  const placeName = (name || "").trim();
  if (placeName && formatted) {
    if (formatted.toLowerCase().startsWith(placeName.toLowerCase())) {
      return formatted;
    }
    return `${placeName}, ${formatted}`;
  }
  return formatted || placeName;
}

function uniqueAddressParts(parts) {
  const seen = new Set();
  return parts.filter((part) => {
    const key = (part || "").trim().toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export default function MapPickerModal({
  isVisible,
  setVisible,
  onSave,
  initialLocation,
  initialAddress,
  toastRef,
}) {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  // Evita que el texto puesto por una selección dispare otra búsqueda (bucles).
  const skipSearchRef = useRef(false);
  const selectingRef = useRef(false);
  // Distingue un tap de un scroll: si el dedo se mueve, no se selecciona.
  const listScrollingRef = useRef(false);
  const listTouchYRef = useRef(0);
  const scrollEndTimerRef = useRef(null);

  const [region, setRegion] = useState(null);
  const [markerCoord, setMarkerCoord] = useState(null);
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [sessionToken, setSessionToken] = useState(() => uuid());

  // Al abrir el modal, ubica el mapa: en la ubicación guardada (editar) o en
  // la ubicación actual del teléfono (crear).
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    let active = true;
    setAddress(initialAddress || "");
    setQuery("");
    setPredictions([]);
    (async () => {
      if (initialLocation && initialLocation.latitude) {
        if (!active) return;
        setRegion(initialLocation);
        setMarkerCoord({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
        });
      } else {
        const response = await getCurrentLocation();
        if (active && response.status) {
          setRegion(response.location);
          setMarkerCoord({
            latitude: response.location.latitude,
            longitude: response.location.longitude,
          });
        }
      }
    })();
    return () => {
      active = false;
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
      listScrollingRef.current = false;
    };
  }, [isVisible]);

  // Autocompletado con debounce: una sola petición cuando el usuario deja de
  // escribir, nunca una por tecla.
  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    const text = query.trim();
    if (text.length < MIN_CHARS) {
      setPredictions([]);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const url =
          `${AUTOCOMPLETE_URL}?input=${encodeURIComponent(text)}` +
          `&key=${googlePlacesApiKey}` +
          `&language=es&components=country:co` +
          `&sessiontoken=${sessionToken}`;
        const response = await fetch(url);
        const json = await response.json();
        if (!active) {
          return;
        }
        if (json.status === "OK") {
          const list = json.predictions || [];
          setPredictions(list);
          // En Android el IME es una ventana transparente a pantalla completa
          // y se come el primer toque (solo cierra el teclado). Al haber
          // sugerencias, se oculta para que el tap llegue a la lista.
          if (list.length > 0) {
            inputRef.current?.blur();
            Keyboard.dismiss();
          }
        } else {
          setPredictions([]);
          if (json.status !== "ZERO_RESULTS") {
            toastRef?.current?.show(
              "No se pudo buscar el lugar: " + json.status,
              3000
            );
          }
        }
      } catch (error) {
        if (active) {
          setPredictions([]);
        }
      } finally {
        if (active) {
          setSearching(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, sessionToken]);

  // Geocodificación inversa GRATIS (geocodificador del sistema, sin Places API).
  const updateAddressFromCoord = async (coord) => {
    try {
      const results = await Location.reverseGeocodeAsync(coord);
      if (results && results.length > 0) {
        const r = results[0];
        const street = [r.street, r.streetNumber].filter(Boolean).join(" ");
        const composed = uniqueAddressParts([
          r.name,
          street,
          r.district,
          r.city || r.subregion,
          r.region,
          r.country,
        ]).join(", ");
        if (composed) {
          setAddress(composed);
        }
      }
    } catch (error) {
      // Silencioso: si falla, igual se guardan las coordenadas del pin.
    }
  };

  const moveMarker = (coord) => {
    setMarkerCoord(coord);
    updateAddressFromCoord(coord);
  };

  // Selección desde el buscador: pide Place Details (solo campos básicos),
  // centra el mapa y cierra la sesión de Places regenerando el token.
  const onSelectPrediction = async (prediction) => {
    if (selectingRef.current) {
      return;
    }
    selectingRef.current = true;
    Keyboard.dismiss();
    setPredictions([]);
    skipSearchRef.current = true;
    const suggestionLabel = buildPlaceLabel({
      description: prediction.description,
    });
    setQuery(suggestionLabel);
    setAddress(suggestionLabel);
    setSearching(true);

    try {
      const url =
        `${DETAILS_URL}?place_id=${prediction.place_id}` +
        `&fields=geometry,name,formatted_address` +
        `&key=${googlePlacesApiKey}` +
        `&language=es&sessiontoken=${sessionToken}`;
      const response = await fetch(url);
      const json = await response.json();

      if (json.status !== "OK" || !json.result?.geometry?.location) {
        toastRef?.current?.show(
          "No se pudo obtener el lugar" +
            (json.status ? `: ${json.status}` : "."),
          3000
        );
        return;
      }

      const { lat, lng } = json.result.geometry.location;
      const coord = { latitude: lat, longitude: lng };
      const newRegion = {
        ...coord,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setMarkerCoord(coord);
      setRegion(newRegion);
      setAddress(
        buildPlaceLabel({
          description: prediction.description,
          name: json.result.name,
          formattedAddress: json.result.formatted_address,
        })
      );
      mapRef.current?.animateToRegion(newRegion, 500);
    } catch (error) {
      toastRef?.current?.show("Error consultando el lugar.", 3000);
    } finally {
      setSearching(false);
      // Evita que el nuevo token dispare otra búsqueda con el texto ya elegido.
      skipSearchRef.current = true;
      setSessionToken(uuid());
      selectingRef.current = false;
    }
  };

  const confirm = () => {
    if (!markerCoord) {
      toastRef?.current?.show("Ajusta o busca la ubicación primero.", 3000);
      return;
    }
    const location = {
      latitude: markerCoord.latitude,
      longitude: markerCoord.longitude,
      latitudeDelta: region?.latitudeDelta || 0.005,
      longitudeDelta: region?.longitudeDelta || 0.005,
    };
    onSave(location, address);
    setVisible(false);
  };

  const markListScrolling = () => {
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = null;
    }
    listScrollingRef.current = true;
  };

  const clearListScrollingSoon = () => {
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }
    // En Android el onPress puede dispararse al soltar tras un scroll.
    // Se deja el flag un instante para ignorar ese toque fantasma.
    scrollEndTimerRef.current = setTimeout(() => {
      listScrollingRef.current = false;
      scrollEndTimerRef.current = null;
    }, 80);
  };

  const onSelectIfTap = (item, pageY) => {
    if (selectingRef.current || listScrollingRef.current) {
      return;
    }
    if (
      typeof pageY === "number" &&
      Math.abs(pageY - listTouchYRef.current) > 10
    ) {
      return;
    }
    onSelectPrediction(item);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.container}>
        <View
          style={styles.mapWrap}
          pointerEvents={predictions.length > 0 ? "none" : "auto"}
          collapsable={false}
        >
          {region && (
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={region}
              showsUserLocation
              onPress={(e) => moveMarker(e.nativeEvent.coordinate)}
            >
              {markerCoord && (
                <Marker
                  coordinate={markerCoord}
                  draggable
                  onDragEnd={(e) => moveMarker(e.nativeEvent.coordinate)}
                />
              )}
            </MapView>
          )}
        </View>

        {/* Flota sobre el mapa: no reserva altura, así el mapa llega al borde. */}
        <View style={styles.searchOverlay} pointerEvents="box-none">
          <View style={styles.inputRow}>
            <Icon
              type="font-awesome"
              name="search"
              color={COLORS.mutedIcon}
              size={16}
            />
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Buscar clínica o dirección..."
              placeholderTextColor={COLORS.placeholder}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={() => {
                inputRef.current?.blur();
                Keyboard.dismiss();
              }}
            />
            {searching ? (
              <ActivityIndicator size="small" color={COLORS.header} />
            ) : query.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setQuery("");
                  setPredictions([]);
                }}
              >
                <Icon
                  type="font-awesome"
                  name="times-circle"
                  color={COLORS.placeholder}
                  size={18}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          {predictions.length > 0 && (
            <FlatList
              style={styles.list}
              data={predictions}
              keyExtractor={(item) => item.place_id}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              nestedScrollEnabled
              removeClippedSubviews={false}
              showsVerticalScrollIndicator
              onTouchStart={(e) => {
                listTouchYRef.current = e.nativeEvent.pageY;
              }}
              onScrollBeginDrag={markListScrolling}
              onScrollEndDrag={clearListScrollingSoon}
              onMomentumScrollEnd={clearListScrollingSoon}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                  ]}
                  // Solo onPress: onPressIn dispara al apoyar el dedo y
                  // convierte el scroll en una selección accidental.
                  onPress={(e) =>
                    onSelectIfTap(item, e.nativeEvent.pageY)
                  }
                >
                  <Icon
                    type="font-awesome"
                    name="map-marker"
                    color={COLORS.header}
                    size={18}
                  />
                  <Text style={styles.rowText} numberOfLines={2}>
                    {item.description}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>

        {/* Dirección seleccionada + botones */}
        <View style={styles.footer}>
          <View style={styles.addressBar}>
            <Icon type="font-awesome" name="map-marker" color="#f4544c" />
            <Text style={styles.addressText} numberOfLines={2}>
              {address || "Arrastra el pin o busca un lugar"}
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnSave} onPress={confirm}>
              <Text style={styles.btnText}>Guardar Ubicación</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    zIndex: 20,
    elevation: 20,
  },
  mapWrap: {
    flex: 1,
    overflow: "hidden",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: COLORS.value,
    padding: 0,
  },
  list: {
    maxHeight: 260,
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    zIndex: 21,
    elevation: 21,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e3e3e3",
    backgroundColor: "#FFFFFF",
  },
  rowPressed: {
    backgroundColor: "#eef6f9",
  },
  rowText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  map: {
    flex: 1,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  addressBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addressText: {
    marginLeft: 8,
    color: "#333",
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btnSave: {
    flex: 1,
    marginRight: 5,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#047ca4",
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    flex: 1,
    marginLeft: 5,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#f4544c",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
