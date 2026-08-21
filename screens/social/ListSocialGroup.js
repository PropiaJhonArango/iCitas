import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Image } from "react-native-elements";

import { COLORS } from "../../components/appointments/appointmentFormUi";

export default function ListSocialGroup({ socialGroup, navigation }) {
  return (
    <FlatList
      data={socialGroup}
      keyExtractor={(item, index) => item.id || String(index)}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={(socialMember) => (
        <MemberCard socialMember={socialMember} navigation={navigation} />
      )}
    />
  );
}

function MemberCard({ socialMember, navigation }) {
  const { nameMember, numberIdentifyMember, phoneNumber, callingCode, images } =
    socialMember.item;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("member-details", { socialMember })}
      activeOpacity={0.75}
    >
      <View style={styles.avatarWrap}>
        {images ? (
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#fff" />}
            source={{ uri: images }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Icon type="font-awesome" name="user" size={18} color="#b7bfc6" />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {nameMember}
        </Text>
        {!!numberIdentifyMember && (
          <View style={styles.meta}>
            <Icon
              type="font-awesome"
              name="id-badge"
              size={12}
              color="#b3bbc2"
            />
            <Text style={styles.metaText} numberOfLines={1}>
              Doc. {numberIdentifyMember}
            </Text>
          </View>
        )}
        {!!phoneNumber && (
          <View style={styles.meta}>
            <Icon type="font-awesome" name="phone" size={12} color="#b3bbc2" />
            <Text style={styles.metaText} numberOfLines={1}>
              +{callingCode} {phoneNumber}
            </Text>
          </View>
        )}
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
  avatarWrap: {
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eef1f3",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#33393e",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  metaText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: "500",
    color: COLORS.label,
  },
});
