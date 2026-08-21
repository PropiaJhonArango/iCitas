import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HistoryAppointments from "../screens/HistoryAppointments";
import Appointment from "../screens/appointments/Appointment";

const Stack = createStackNavigator();

export default function HistoryAppointmentsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="historyAppointment"
        component={HistoryAppointments}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="appointment"
        component={Appointment}
        options={{
          title: "Editar Cita",
          headerTitleStyle: {
            color: "#FFFFFF",
            fontWeight: "800",
            fontSize: 18,
            letterSpacing: 0.2,
          },
          headerStyle: {
            backgroundColor: "#357288",
            borderBottomLeftRadius: 22,
            borderBottomRightRadius: 22,
            elevation: 8,
            shadowColor: "#357288",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
          },
          headerTintColor: "#FFFFFF",
          headerTitleAlign: "center",
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          cardStyle: {
            backgroundColor: "#eceae6",
          },
        }}
      />
    </Stack.Navigator>
  );
}
