import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsAccount from "../screens/accountSettings/SettingsAccount";
import TagsAccount from "../screens/accountSettings/TagsAccount";
import TagAccount from "../screens/accountSettings/TagAccount";
import AddTags from "../screens/accountSettings/AddTags";
import NotificationsSettings from "../screens/accountSettings/NotificationsSettings";
import { stackHeaderOptions } from "../components/appointments/appointmentFormUi";

const Stack = createStackNavigator();

export default function SettingsAccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="settingsAccount"
        component={SettingsAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="notifications"
        component={NotificationsSettings}
        options={stackHeaderOptions("Notificaciones")}
      />
      <Stack.Screen
        name="tags"
        component={TagsAccount}
        options={stackHeaderOptions("Etiquetas")}
      />
      <Stack.Screen
        name="add-tags"
        component={AddTags}
        options={stackHeaderOptions("Crear Etiqueta")}
      />
      <Stack.Screen
        name="tag"
        component={TagAccount}
        options={stackHeaderOptions("Editar Etiqueta")}
      />
    </Stack.Navigator>
  );
}
