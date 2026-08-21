import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import { size } from "lodash";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

import AppointmentsFilter, {
  applyAppointmentFilters,
  emptyFilters,
  hasActiveFilters,
} from "../../components/appointments/AppointmentsFilter";
import { getAllSocialGroup, getAllTags, getCurrentUser } from "../../utils/actions";
import {
  COLORS,
  tagsToArray,
  toJsDate,
} from "../../components/appointments/appointmentFormUi";

export default function ListAppointments({
  appointments,
  navigation,
  handleLoadMore,
}) {
  const [userTags, setUserTags] = useState([]);
  const [photosByPatient, setPhotosByPatient] = useState({});
  const [filters, setFilters] = useState(emptyFilters());
  const [dateAsc, setDateAsc] = useState(true);
  const user = getCurrentUser();

  useFocusEffect(
    useCallback(() => {
      async function loadExtras() {
        if (!user?.uid) {
          return;
        }
        const [tagsResponse, socialResponse] = await Promise.all([
          getAllTags(user.uid),
          getAllSocialGroup(user.uid),
        ]);
        if (tagsResponse.statusResponse) {
          setUserTags(
            tagsResponse.tags.map((doc) => ({
              id: doc.id,
              tagColor: doc.tagColor,
              tagName: doc.tagName,
            }))
          );
        }
        if (socialResponse.statusResponse) {
          const photos = {};
          socialResponse.socialGroup.forEach((member) => {
            if (member.idMemberUser && member.images) {
              photos[member.idMemberUser] = member.images;
            }
          });
          setPhotosByPatient(photos);
        }
      }
      loadExtras();
    }, [])
  );

  const filteredAppointments = applyAppointmentFilters(appointments, filters);
  const sortedAppointments = useMemo(() => {
    const list = [...filteredAppointments];
    list.sort((a, b) => {
      const timeA = toJsDate(a.dateAndTime)?.getTime() || 0;
      const timeB = toJsDate(b.dateAndTime)?.getTime() || 0;
      return dateAsc ? timeA - timeB : timeB - timeA;
    });
    return list;
  }, [filteredAppointments, dateAsc]);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.filters}>
          <AppointmentsFilter
            appointments={appointments}
            userTags={userTags}
            filters={filters}
            onChange={setFilters}
          />
        </View>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setDateAsc((prev) => !prev)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Ordenar por fecha"
        >
          <Icon
            type="font-awesome"
            name={dateAsc ? "sort-amount-asc" : "sort-amount-desc"}
            size={15}
            color={COLORS.header}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedAppointments}
        keyExtractor={(item, index) => item.id || String(index)}
        onEndReachedThreshold={0.5}
        onEndReached={hasActiveFilters(filters) ? undefined : handleLoadMore}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              No hay citas con esos filtros
            </Text>
          </View>
        }
        renderItem={(appointment) => (
          <AppointmentCard
            appointment={appointment}
            navigation={navigation}
            userTags={userTags}
            photosByPatient={photosByPatient}
          />
        )}
      />
    </View>
  );
}

function resolveTags(idTags, userTags) {
  return tagsToArray(idTags)
    .map((id) => userTags.find((tag) => tag.id === id))
    .filter(Boolean)
    .map((tag) => ({
      id: tag.id,
      name: tag.tagName,
      color: tag.tagColor || COLORS.header,
    }));
}

function AppointmentCard({
  appointment,
  navigation,
  userTags,
  photosByPatient,
}) {
  const { namePatient, name, dateAndTime, address, idTags, idPatient } =
    appointment.item;
  const user = getCurrentUser();
  const isSelf =
    idPatient === user?.uid ||
    (namePatient && namePatient.substr(0, 4) === "Yo (");
  const patientLabel = isSelf
    ? "Yo (" + (user?.displayName || "") + ")"
    : namePatient || "Paciente";
  const date = toJsDate(dateAndTime);
  const dateLabel = date ? moment(date).format("YYYY-MM-DD · hh:mm A") : "";
  const tags = resolveTags(idTags, userTags);
  const photoUri = isSelf
    ? user?.photoURL
    : photosByPatient[idPatient] || null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("appointment", { appointment })}
      activeOpacity={0.75}
    >
      <View style={styles.cardTop}>
        <View style={styles.avatarWrap}>
          {photoUri ? (
            <Image
              resizeMode="cover"
              PlaceholderContent={<ActivityIndicator color="#fff" />}
              source={{ uri: photoUri }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Icon
                type="font-awesome"
                name="user"
                size={18}
                color="#b7bfc6"
              />
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {patientLabel}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {name}
          </Text>
          {!!dateLabel && (
            <View style={styles.meta}>
              <Icon
                type="font-awesome"
                name="clock-o"
                size={12}
                color="#b3bbc2"
              />
              <Text style={styles.metaText} numberOfLines={1}>
                {dateLabel}
              </Text>
            </View>
          )}
          {!!address && (
            <View style={styles.meta}>
              <Icon
                type="font-awesome"
                name="map-marker"
                size={12}
                color="#b3bbc2"
              />
              <Text style={styles.metaText} numberOfLines={1}>
                {address}
              </Text>
            </View>
          )}
        </View>
      </View>

      {size(tags) > 0 && (
        <View style={styles.tags}>
          {tags.map((tag) => (
            <View
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color }]}
            >
              <Icon
                type="font-awesome"
                name="angle-double-right"
                size={10}
                color={COLORS.white}
              />
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  filters: {
    flex: 1,
    minWidth: 0,
  },
  sortBtn: {
    marginTop: 12,
    marginRight: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  list: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 88,
    flexGrow: 1,
  },
  emptyWrap: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.label,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
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
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7c848b",
    marginTop: 2,
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
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 11,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
  },
});
