import "./utils/keyboardPolyfill";
import React, { useState, useEffect } from "react";
import { AppState, LogBox, StatusBar } from "react-native";
import Navigation from "./navigations/Navigation";
import { NavigationContainer } from "@react-navigation/native";

import RootStack from "./navigations/RootStack";
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { COLORS } from "./components/appointments/appointmentFormUi";
import {
  cancelAllAppointmentReminders,
  syncAppointmentReminders,
} from "./utils/notifications";

LogBox.ignoreAllLogs(true);

export default function App() {
  const [logged, setLogged] = useState(false);

  // Firebase restaura la sesión de forma asíncrona al arrancar. onAuthStateChanged
  // reacciona a ese restore (y a login/logout), así la sesión persiste al reiniciar.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLogged(!!user);
      if (user) {
        syncAppointmentReminders();
      } else {
        cancelAllAppointmentReminders();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && auth.currentUser) {
        syncAppointmentReminders();
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.header}
        translucent={false}
      />
      <NavigationContainer>
        {logged ? (
          <Navigation setLogged={setLogged} />
        ) : (
          <RootStack setLogged={setLogged} />
        )}
      </NavigationContainer>
    </>
  );
}
