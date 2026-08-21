import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "./appointmentFormUi";

export const ITEM_H = 44;
export const VISIBLE = 5;
const PAD = ITEM_H * 2;

export function pad2(value) {
  return String(value).padStart(2, "0");
}

export function Wheel({
  values,
  value,
  onChange,
  formatLabel = pad2,
  width = 88,
}) {
  const listRef = useRef(null);
  const index = Math.max(0, values.indexOf(value));

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: index * ITEM_H,
        animated: false,
      });
    }, 40);
    return () => clearTimeout(timer);
  }, [index, values.length]);

  const onMomentumScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const next = Math.round(y / ITEM_H);
    const clamped = Math.max(0, Math.min(values.length - 1, next));
    if (values[clamped] !== value) {
      onChange(values[clamped]);
    }
  };

  return (
    <View style={[styles.wheel, { width }]}>
      <View pointerEvents="none" style={styles.selectionBand} />
      <FlatList
        ref={listRef}
        data={values}
        extraData={value}
        keyExtractor={(item) => String(item)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(_, i) => ({
          length: ITEM_H,
          offset: ITEM_H * i,
          index: i,
        })}
        contentContainerStyle={{ paddingVertical: PAD }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => {
          const selected = item === value;
          return (
            <View style={styles.item}>
              <Text
                style={[styles.itemText, selected && styles.itemTextActive]}
                numberOfLines={1}
              >
                {formatLabel(item)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

export function SpinnerSheet({
  visible,
  title,
  preview,
  onCancel,
  onAccept,
  children,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <View style={styles.wheels}>{children}</View>
          {!!preview && <Text style={styles.preview}>{preview}</Text>}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={onAccept}
              activeOpacity={0.8}
            >
              <Text style={styles.acceptText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    backgroundColor: COLORS.header,
    paddingVertical: 14,
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },
  wheels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  wheel: {
    height: ITEM_H * VISIBLE,
  },
  selectionBand: {
    position: "absolute",
    left: 0,
    right: 0,
    top: ITEM_H * 2,
    height: ITEM_H,
    borderRadius: 12,
    backgroundColor: COLORS.chipActiveBg,
  },
  item: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.placeholder,
  },
  itemTextActive: {
    color: COLORS.header,
    fontWeight: "800",
    fontSize: 20,
  },
  preview: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.value,
    marginTop: 4,
    marginBottom: 8,
    textTransform: "capitalize",
    paddingHorizontal: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.chipBg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontWeight: "700",
    color: COLORS.chipText,
    fontSize: 14,
  },
  acceptBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.header,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: {
    fontWeight: "800",
    color: COLORS.white,
    fontSize: 14,
  },
});
