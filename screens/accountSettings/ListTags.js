import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";

import { COLORS } from "../../components/appointments/appointmentFormUi";

export default function ListTags({ tags, navigation }) {
  return (
    <FlatList
      data={tags}
      keyExtractor={(item, index) => item.id || String(index)}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={(tag) => <TagCard tag={tag} navigation={navigation} />}
    />
  );
}

function TagCard({ tag, navigation }) {
  const { tagName, tagColor } = tag.item;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("tag", { tag })}
      activeOpacity={0.75}
    >
      <View
        style={[styles.dot, { backgroundColor: tagColor || COLORS.header }]}
      />
      <View style={styles.info}>
        <Text style={styles.label}>ETIQUETA</Text>
        <Text style={styles.name} numberOfLines={1}>
          {tagName}
        </Text>
      </View>
      <Icon
        type="font-awesome"
        name="chevron-right"
        size={14}
        color={COLORS.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 88,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: COLORS.label,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.value,
    marginTop: 1,
  },
});
