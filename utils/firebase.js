// import firebase from 'firebase/app'
// import 'firebase/firestore'

//   const firebaseConfig = {
//     apiKey: "AIzaSyDCQlFts75oWlXhCh9mF-t4PsN5JKSspeI",
//     authDomain: "icitas-6e1b2.firebaseapp.com",
//     projectId: "icitas-6e1b2",
//     storageBucket: "icitas-6e1b2.appspot.com",
//     messagingSenderId: "1051790192767",
//     appId: "1:1051790192767:web:5d70485b54730b0c98cf4a"
//   }

//   export const firebaseApp = firebase.initializeApp(firebaseConfig);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCQlFts75oWlXhCh9mF-t4PsN5JKSspeI",
  authDomain: "icitas-6e1b2.firebaseapp.com",
  projectId: "icitas-6e1b2",
  storageBucket: "icitas-6e1b2.appspot.com",
  messagingSenderId: "1051790192767",
  appId: "1:1051790192767:web:5d70485b54730b0c98cf4a",
};

// Web client ID (OAuth 2.0) que Firebase genera al habilitar el proveedor Google
// en Authentication > Método de acceso. Se usa para configurar GoogleSignin.
// TODO: reemplazar por el "ID de cliente web" real de la consola de Firebase.
export const googleWebClientId =
  "1051790192767-3bp11j0k5tlkat6mt4mmlrdlueifkkui.apps.googleusercontent.com";

// Key SEPARADA solo para la Places API (buscador de lugares del mapa).
// Debe estar restringida por API = "Places API" y restricción de aplicación
// = "Ninguna" (Places se llama por HTTP web service, no por el SDK de Android,
// por eso NO sirve la key de Maps que está restringida a apps de Android).
// TODO: reemplazar por la key nueva de Places creada en Google Cloud Console.
export const googlePlacesApiKey = "AIzaSyBXQuVS79gSyEfC5Sz9eoSkp5-hlDnFcTI";

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
// initializeAuth + AsyncStorage: mantiene la sesión iniciada al reiniciar la app.
// (getAuth() en React Native usa persistencia en memoria y pierde la sesión.)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);
