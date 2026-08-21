import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Social from "../screens/social/Social";
import AddSocial from "../screens/social/AddSocial";
import MemberDetails from "../screens/social/MemberDetails";
import { stackHeaderOptions } from "../components/appointments/appointmentFormUi";

const Stack = createStackNavigator();

export default function SocialStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="social"
        component={Social}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="add-social"
        component={AddSocial}
        options={stackHeaderOptions("Añadir Integrante")}
      />
      <Stack.Screen
        name="member-details"
        component={MemberDetails}
        options={stackHeaderOptions("Editar Integrante")}
      />
    </Stack.Navigator>
  );
}
