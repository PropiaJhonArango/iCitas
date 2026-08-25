// import { firebaseApp } from "./firebase";
// import * as firebase from "firebase";
// import { fileToBlob } from "./helpers";
// import { LogBox } from "react-native";

// LogBox.ignoreAllLogs();
// LogBox.ignoreLogs(["Setting a timer"]);

// const db = firebase.firestore(firebaseApp);

// export const isUserLogged = () => {
//   let isLogged = false;
//   firebase.auth().onAuthStateChanged((user) => {
//     user !== null && (isLogged = true);
//   });
//   return isLogged;
// };

// export const getCurrentUser = () => {
//   return firebase.auth().currentUser;
// };

// export const registerUser = async (email, password) => {
//   const result = { statusResponse: true, error: null };

//   try {
//     await firebase.auth().createUserWithEmailAndPassword(email, password);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = "Este correo ya ha sido registrado.";
//   }

//   return result;
// };

// export const loginWithEmailAndPassword = async (email, password) => {
//   const result = { statusResponse: true, error: null };

//   try {
//     await firebase.auth().signInWithEmailAndPassword(email, password);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = "Usuario o contraseña incorrectos.";
//   }

//   return result;
// };

// export const closeSession = () => {
//   return firebase.auth().signOut();
// };

// export const uploadImage = async (image, path, name) => {
//   const result = { statusResponse: false, error: null, url: null };
//   const ref = firebase.storage().ref(path).child(name);
//   const blob = await fileToBlob(image);

//   try {
//     await ref.put(blob);
//     const url = await firebase
//       .storage()
//       .ref(`${path}/${name}`)
//       .getDownloadURL();
//     result.statusResponse = true;
//     result.url = url;
//   } catch (error) {
//     result.error = error;
//   }

//   return result;
// };
// export const updateProfile = async (data) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await firebase.auth().currentUser.updateProfile(data);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const reauthenticateFirebase = async (password) => {
//   const result = { statusResponse: true, error: null };
//   const user = getCurrentUser();
//   const credentials = firebase.auth.EmailAuthProvider.credential(
//     user.email,
//     password
//   );

//   try {
//     await user.reauthenticateWithCredential(credentials);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const updateEmailFirebase = async (newEmail) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await firebase.auth().currentUser.updateEmail(newEmail);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const updatePasswordFirebase = async (newPassword) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await firebase.auth().currentUser.updatePassword(newPassword);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const addDocumentWithId = async (collection, data) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await db.collection(collection).doc(data.uidUser).set(data);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const addDocumentWithoutId = async (collection, data) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await db.collection(collection).add(data);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const updateDocument = async (collection, id, data) => {
//   const result = {
//     statusResponse: false,
//     error: null,
//   };

//   try {
//     await db.collection(collection).doc(id).update(data);
//     result.statusResponse = true;
//   } catch (error) {
//     result.error = error;
//   }

//   return result;
// };

// export const getCollectionWithId = async (collection, id) => {
//   const result = {
//     statusResponse: false,
//     data: null,
//     error: null,
//   };

//   try {
//     const data = await db.collection(collection).doc(id).get();
//     const arrayData = data.data();
//     arrayData.id = data.id;
//     result.statusResponse = true;
//     result.data = arrayData;
//   } catch (error) {
//     result.error = error;
//   }

//   return result;
// };

// export const getAppointments = async (limitAppointments, idCurrentUser) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await db
//       .collection("Appointments")
//       .orderBy("dateAndTime", "asc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", ">=", new Date())
//       .limit(limitAppointments)
//       .get();
//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getMoreAppointments = async (
//   limitAppointments,
//   idCurrentUser,
//   startAppointment
// ) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await db
//       .collection("Appointments")
//       .orderBy("dateAndTime", "asc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", ">=", new Date())
//       .startAfter(startAppointment.data().dateAndTime)
//       .limit(limitAppointments)
//       .get();
//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getAppointmentsExpired = async (
//   limitAppointments,
//   idCurrentUser
// ) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await db
//       .collection("Appointments")
//       .orderBy("dateAndTime", "desc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", "<", new Date())
//       .limit(limitAppointments)
//       .get();

//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getMoreAppointmentsExpired = async (
//   limitAppointments,
//   idCurrentUser,
//   startAppointment
// ) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await db
//       .collection("Appointments")
//       .orderBy("dateAndTime", "desc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", "<", new Date())
//       .startAfter(startAppointment.data().dateAndTime)
//       .limit(limitAppointments)
//       .get();

//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }

//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getSocialGroup = async (limitSocialGroup, idCurrentUser) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     socialGroup: [],
//     startSocialGroup: null,
//   };
//   try {
//     const response = await db
//       .collection("SocialGroup")
//       .where("idMainUser", "==", idCurrentUser)
//       .limit(limitSocialGroup)
//       .get();
//     if (response.docs.length > 0) {
//       result.startSocialGroup = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const social = doc.data();
//       social.id = doc.id;
//       result.socialGroup.push(social);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getMoreSocialGroup = async (
//   limitSocialGroup,
//   idCurrentUser,
//   startSocialGroup
// ) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     socialGroup: [],
//     startSocialGroup: null,
//   };
//   try {
//     const response = await db
//       .collection("SocialGroup")
//       .orderBy("createdDate", "desc")
//       .where("idMainUser", "==", idCurrentUser)
//       .startAfter(startSocialGroup.data().idMainUser)
//       .limit(limitSocialGroup)
//       .get();

//     if (response.docs.length > 0) {
//       result.startSocialGroup = response.docs[response.docs.length - 1];
//     }

//     response.forEach((doc) => {
//       const social = doc.data();
//       social.id = doc.id;
//       result.socialGroup.push(social);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getAllSocialGroup = async (idCurrentUser) => {
//   const result = { statusResponse: true, error: null, socialGroup: [] };
//   try {
//     const response = await db
//       .collection("SocialGroup")
//       .where("idMainUser", "==", idCurrentUser)
//       .get();

//     response.forEach((doc) => {
//       const social = doc.data();
//       social.id = doc.id;
//       result.socialGroup.push(social);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getTags = async (limitTags, idCurrentUser) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     tags: [],
//     startTags: null,
//   };
//   try {
//     const response = await db
//       .collection("UserTags")
//       .where("ownerId", "==", idCurrentUser)
//       .limit(limitTags)
//       .get();
//     if (response.docs.length > 0) {
//       result.startTags = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const tag = doc.data();
//       tag.id = doc.id;
//       result.tags.push(tag);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getMoreTags = async (limitTags, idCurrentUser, startTags) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     tags: [],
//     startTags: null,
//   };
//   try {
//     const response = await db
//       .collection("UserTags")
//       .orderBy("createdDate", "desc")
//       .where("ownerId", "==", idCurrentUser)
//       .startAfter(startTags.data().ownerId)
//       .limit(limitTags)
//       .get();

//     if (response.docs.length > 0) {
//       result.startTags = response.docs[response.docs.length - 1];
//     }

//     response.forEach((doc) => {
//       const tag = doc.data();
//       tag.id = doc.id;
//       result.tags.push(tag);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getAllTags = async (idCurrentUser) => {
//   const result = { statusResponse: true, error: null, tags: [] };
//   try {
//     const response = await db
//       .collection("UserTags")
//       .where("ownerId", "==", idCurrentUser)
//       .get();

//     response.forEach((doc) => {
//       const tag = doc.data();
//       tag.id = doc.id;
//       result.tags.push(tag);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const deleteDocument = async (collection, id) => {
//   const result = {
//     statusResponse: false,
//     error: null,
//   };

//   try {
//     await db.collection(collection).doc(id).delete();
//     result.statusResponse = true;
//   } catch (error) {
//     result.error = error;
//   }

//   return result;
// };

// import { auth, storage } from "./firebase";
// import { firestore } from "./firebase"; // Importar firestore específicamente
// import { fileToBlob } from "./helpers";
// import { LogBox } from "react-native";

// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   updateProfile,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
//   updateEmail,
//   updatePassword,
// } from "firebase/auth";

// LogBox.ignoreAllLogs();
// LogBox.ignoreLogs(["Setting a timer"]);

// export const isUserLogged = () => {
//   let isLogged = false;
//   auth.onAuthStateChanged((user) => {
//     user !== null && (isLogged = true);
//   });
//   return isLogged;
// };

// export const getCurrentUser = () => {
//   return auth.currentUser;
// };

// export const registerUser = async (email, password) => {
//   const result = { statusResponse: true, error: null };

//   try {
//     await createUserWithEmailAndPassword(auth, email, password);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = "Este correo ya ha sido registrado.";
//   }

//   return result;
// };

// export const loginWithEmailAndPassword = async (email, password) => {
//   const result = { statusResponse: true, error: null };

//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = "Usuario o contraseña incorrectos.";
//   }
//   return result;
// };

// export const closeSession = () => {
//   return signOut(auth);
// };

// export const uploadImage = async (image, path, name) => {
//   const result = { statusResponse: false, error: null, url: null };
//   const ref = storage.ref(path).child(name);
//   const blob = await fileToBlob(image);

//   try {
//     await ref.put(blob);
//     const url = await storage.ref(`${path}/${name}`).getDownloadURL();
//     result.statusResponse = true;
//     result.url = url;
//   } catch (error) {
//     result.error = error;
//   }

//   return result;
// };

// export const updateUserProfile = async (data) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await updateProfile(auth.currentUser, data);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const reauthenticateFirebase = async (password) => {
//   const result = { statusResponse: true, error: null };
//   const user = getCurrentUser();
//   const credentials = EmailAuthProvider.credential(user.email, password);

//   try {
//     await reauthenticateWithCredential(user, credentials);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const updateEmailFirebase = async (newEmail) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await updateEmail(auth.currentUser, newEmail);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const updatePasswordFirebase = async (newPassword) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await updatePassword(auth.currentUser, newPassword);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const addDocumentWithId = async (collection, data) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await firestore.collection(collection).doc(data.uidUser).set(data);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const addDocumentWithoutId = async (collection, data) => {
//   const result = { statusResponse: true, error: null };
//   try {
//     await firestore.collection(collection).add(data);
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const updateDocument = async (collection, id, data) => {
//   const result = {
//     statusResponse: false,
//     error: null,
//   };

//   try {
//     await firestore.collection(collection).doc(id).update(data);
//     result.statusResponse = true;
//   } catch (error) {
//     result.error = error;
//   }

//   return result;
// };

// export const getCollectionWithId = async (collection, id) => {
//   const result = {
//     statusResponse: false,
//     data: null,
//     error: null,
//   };

//   try {
//     const data = await firestore.collection(collection).doc(id).get();
//     const arrayData = data.data();
//     arrayData.id = data.id;
//     result.statusResponse = true;
//     result.data = arrayData;
//   } catch (error) {
//     result.error = error;
//   }

//   return result;
// };

// export const getAppointments = async (limitAppointments, idCurrentUser) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await firestore
//       .collection("Appointments")
//       .orderBy("dateAndTime", "asc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", ">=", new Date())
//       .limit(limitAppointments)
//       .get();
//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getMoreAppointments = async (
//   limitAppointments,
//   idCurrentUser,
//   startAppointment
// ) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await firestore
//       .collection("Appointments")
//       .orderBy("dateAndTime", "asc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", ">=", new Date())
//       .startAfter(startAppointment.data().dateAndTime)
//       .limit(limitAppointments)
//       .get();
//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getAppointmentsExpired = async (
//   limitAppointments,
//   idCurrentUser
// ) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await firestore
//       .collection("Appointments")
//       .orderBy("dateAndTime", "desc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", "<", new Date())
//       .limit(limitAppointments)
//       .get();

//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

// export const getMoreAppointmentsExpired = async (
//   limitAppointments,
//   idCurrentUser,
//   startAppointment
// ) => {
//   const result = {
//     statusResponse: true,
//     error: null,
//     appointments: [],
//     startAppointment: null,
//   };
//   try {
//     const response = await firestore
//       .collection("Appointments")
//       .orderBy("dateAndTime", "desc")
//       .where("idCreator", "==", idCurrentUser)
//       .where("dateAndTime", "<", new Date())
//       .startAfter(startAppointment.data().dateAndTime)
//       .limit(limitAppointments)
//       .get();

//     if (response.docs.length > 0) {
//       result.startAppointment = response.docs[response.docs.length - 1];
//     }
//     response.forEach((doc) => {
//       const appointment = doc.data();
//       appointment.id = doc.id;
//       result.appointments.push(appointment);
//     });
//   } catch (error) {
//     result.statusResponse = false;
//     result.error = error;
//   }
//   return result;
// };

import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { auth, firestore, googleWebClientId } from "./firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getCountFromServer,
} from "firebase/firestore";

import { LogBox } from "react-native";

import { fileToBlob } from "./helpers"; // Ensure this import is correct
import { storage } from "./firebase"; // Ensure storage is correctly imported
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["Setting a timer"]);

export const isUserLogged = () => {
  let isLogged = false;
  auth.onAuthStateChanged((user) => {
    user !== null && (isLogged = true);
  });
  return isLogged;
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const registerUser = async (email, password) => {
  const result = { statusResponse: true, error: null };

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = "Este correo ya ha sido registrado.";
  }

  return result;
};

export const loginWithEmailAndPassword = async (email, password) => {
  const result = { statusResponse: true, error: null };

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = "Usuario o contraseña incorrectos.";
  }
  return result;
};

// Android guarda la última cuenta de Google usada en esta app. Si no se
// cierra esa sesión, el siguiente GoogleSignin.signIn() reutiliza esa cuenta
// y no muestra el selector. Hay que llamarlo también al cerrar sesión de Firebase.
export const closeGoogleSession = async () => {
  try {
    GoogleSignin.configure({ webClientId: googleWebClientId });
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
  } catch (error) {
    // Si el usuario no entró con Google, no hay sesión nativa que limpiar.
  }
};

export const closeSession = async () => {
  await closeGoogleSession();
  return signOut(auth);
};

// Recibe el idToken devuelto por GoogleSignin (código nativo, ver Login.js),
// lo canjea por una credencial de Firebase e inicia sesión. Si es la primera
// vez que entra la cuenta, crea su documento en la colección Users.
export const loginWithGoogle = async (idToken) => {
  const result = { statusResponse: true, error: null, user: null };
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;
    result.user = user;

    const userRef = doc(firestore, "Users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        numberIdentify: "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        callingCode: "",
        createdDate: new Date(),
        isAppUser: true,
        photoURL: user.photoURL || "",
        uidUser: user.uid,
      });
    }
  } catch (error) {
    console.log("loginWithGoogle ERROR:", error?.code, error?.message);
    result.statusResponse = false;
    result.error = error?.code || "No se pudo iniciar sesión con Google.";
  }
  return result;
};

//YA
export const uploadImage = async (image, path, name, contentType) => {
  const result = { statusResponse: false, error: null, url: null };
  try {
    if (!image) {
      throw new Error("La imagen es null o undefined");
    }
    const response = await fetch(image);
    const blob = await response.blob();

    const storageRef = ref(storage, `${path}/${name}`);
    const metadata = contentType ? { contentType } : undefined;

    await uploadBytes(storageRef, blob, metadata);
    const url = await getDownloadURL(storageRef);

    result.statusResponse = true;
    result.url = url;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const updateUserProfile = async (data) => {
  const result = { statusResponse: true, error: null };
  try {
    await updateProfile(auth.currentUser, data);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const reauthenticateFirebase = async (password) => {
  const result = { statusResponse: true, error: null };
  const user = getCurrentUser();
  const credentials = EmailAuthProvider.credential(user.email, password);

  try {
    await reauthenticateWithCredential(user, credentials);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const updateEmailFirebase = async (newEmail) => {
  const result = { statusResponse: true, error: null };
  try {
    await updateEmail(auth.currentUser, newEmail);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const updatePasswordFirebase = async (newPassword) => {
  const result = { statusResponse: true, error: null };
  try {
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

//YA
export const addDocumentWithId = async (collectionName, data) => {
  const result = { statusResponse: true, error: null };
  try {
    const docRef = doc(firestore, collectionName, data.uidUser);
    await setDoc(docRef, data);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const addDocumentWithoutId = async (collectionName, data) => {
  const result = { statusResponse: true, error: null, id: null };
  try {
    const colRef = collection(firestore, collectionName);
    const docRef = await addDoc(colRef, data);
    result.id = docRef.id;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const updateDocument = async (collectionName, id, data) => {
  const result = { statusResponse: true, error: null };
  try {
    const docRef = doc(firestore, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }

  return result;
};
//YA
export const getCollectionWithId = async (collectionName, id) => {
  const result = {
    statusResponse: true,
    data: null,
    error: null,
  };
  try {
    const docRef = doc(firestore, collectionName, id); //firestore.collection(collectionName).doc(id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      result.data = docSnap.data();
      result.data.id = docSnap.id;
    } else {
      result.statusResponse = false;
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const getAppointments = async (limitAppointments, idCurrentUser) => {
  const result = {
    statusResponse: true,
    error: null,
    appointments: [],
    startAppointment: null,
  };

  try {
    const appointmentsRef = collection(firestore, "Appointments");
    const constraints = [
      where("idCreator", "==", idCurrentUser),
      where("dateAndTime", ">=", new Date()),
      orderBy("dateAndTime", "asc"),
    ];
    if (limitAppointments) {
      constraints.push(limit(limitAppointments));
    }
    const q = query(appointmentsRef, ...constraints);

    const response = await getDocs(q);

    if (!response.empty) {
      result.startAppointment = response.docs[response.docs.length - 1];
      response.forEach((doc) => {
        const appointment = doc.data();
        appointment.id = doc.id;
        result.appointments.push(appointment);
      });
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }

  return result;
};

export const getMoreAppointments = async (
  limitAppointments,
  idCurrentUser,
  startAppointment
) => {
  const result = {
    statusResponse: true,
    error: null,
    appointments: [],
    startAppointment: null,
  };
  try {
    const q = firestore
      .collection("Appointments")
      .orderBy("dateAndTime", "asc")
      .where("idCreator", "==", idCurrentUser)
      .where("dateAndTime", ">=", new Date())
      .startAfter(startAppointment.dateAndTime)
      .limit(limitAppointments);

    const response = await getDocs(q);

    if (!response.empty) {
      result.startAppointment = response.docs[response.docs.length - 1];
      response.forEach((doc) => {
        const appointment = doc.data();
        appointment.id = doc.id;
        result.appointments.push(appointment);
      });
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const getAppointmentsExpired = async (
  limitAppointments,
  idCurrentUser
) => {
  const result = {
    statusResponse: true,
    error: null,
    appointments: [],
    startAppointment: null,
  };
  try {
    const appointmentsRef = collection(firestore, "Appointments");
    const constraints = [
      where("idCreator", "==", idCurrentUser),
      where("dateAndTime", "<", new Date()),
      orderBy("dateAndTime", "asc"),
    ];
    if (limitAppointments) {
      constraints.push(limit(limitAppointments));
    }
    const q = query(appointmentsRef, ...constraints);

    const response = await getDocs(q);

    if (!response.empty) {
      result.startAppointment = response.docs[response.docs.length - 1];
      response.forEach((doc) => {
        const appointment = doc.data();
        appointment.id = doc.id;
        result.appointments.push(appointment);
      });
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getAppointmentsCounts = async (idCurrentUser) => {
  const result = {
    statusResponse: true,
    error: null,
    pending: 0,
    expired: 0,
  };
  try {
    const appointmentsRef = collection(firestore, "Appointments");
    const now = new Date();
    const pendingQuery = query(
      appointmentsRef,
      where("idCreator", "==", idCurrentUser),
      where("dateAndTime", ">=", now)
    );
    const expiredQuery = query(
      appointmentsRef,
      where("idCreator", "==", idCurrentUser),
      where("dateAndTime", "<", now)
    );
    const [pendingSnap, expiredSnap] = await Promise.all([
      getCountFromServer(pendingQuery),
      getCountFromServer(expiredQuery),
    ]);
    result.pending = pendingSnap.data().count;
    result.expired = expiredSnap.data().count;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getMoreAppointmentsExpired = async (
  limitAppointments,
  idCurrentUser,
  startAppointment
) => {
  const result = {
    statusResponse: true,
    error: null,
    appointments: [],
    startAppointment: null,
  };
  try {
    const response = await firestore
      .collection("Appointments")
      .orderBy("dateAndTime", "desc")
      .where("idCreator", "==", idCurrentUser)
      .where("dateAndTime", "<", new Date())
      .startAfter(startAppointment.data().dateAndTime)
      .limit(limitAppointments)
      .get();

    if (response.docs.length > 0) {
      result.startAppointment = response.docs[response.docs.length - 1];
    }
    response.forEach((doc) => {
      const appointment = doc.data();
      appointment.id = doc.id;
      result.appointments.push(appointment);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const getSocialGroup = async (limitSocialGroup, idCurrentUser) => {
  const result = {
    statusResponse: true,
    error: null,
    socialGroup: [],
    startSocialGroup: null,
  };
  try {
    const socialGroupRef = collection(firestore, "SocialGroup");
    const q = query(
      socialGroupRef,
      where("idMainUser", "==", idCurrentUser),
      limit(limitSocialGroup)
    );

    const response = await getDocs(q);

    if (response.docs.length > 0) {
      result.startSocialGroup = response.docs[response.docs.length - 1];
    }
    response.forEach((doc) => {
      const social = doc.data();
      social.id = doc.id;
      result.socialGroup.push(social);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getMoreSocialGroup = async (
  limitSocialGroup,
  idCurrentUser,
  startSocialGroup
) => {
  const result = {
    statusResponse: true,
    error: null,
    socialGroup: [],
    startSocialGroup: null,
  };
  try {
    const response = await db
      .collection("SocialGroup")
      .orderBy("createdDate", "desc")
      .where("idMainUser", "==", idCurrentUser)
      .startAfter(startSocialGroup.data().idMainUser)
      .limit(limitSocialGroup)
      .get();

    if (response.docs.length > 0) {
      result.startSocialGroup = response.docs[response.docs.length - 1];
    }

    response.forEach((doc) => {
      const social = doc.data();
      social.id = doc.id;
      result.socialGroup.push(social);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const getAllSocialGroup = async (idCurrentUser) => {
  const result = { statusResponse: true, error: null, socialGroup: [] };
  try {
    const socialGroupRef = collection(firestore, "SocialGroup");
    const q = query(socialGroupRef, where("idMainUser", "==", idCurrentUser));
    const response = await getDocs(q);

    response.forEach((doc) => {
      const social = doc.data();
      social.id = doc.id;
      result.socialGroup.push(social);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const getTags = async (limitTags, idCurrentUser) => {
  const result = {
    statusResponse: true,
    error: null,
    tags: [],
    startTags: null,
  };
  try {
    const tagsRef = collection(firestore, "UserTags");
    const q = query(
      tagsRef,
      where("ownerId", "==", idCurrentUser),
      limit(limitTags)
    );

    const response = await getDocs(q);

    if (response.docs.length > 0) {
      result.startTags = response.docs[response.docs.length - 1];
    }
    response.forEach((doc) => {
      const tag = doc.data();
      tag.id = doc.id;
      result.tags.push(tag);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getMoreTags = async (limitTags, idCurrentUser, startTags) => {
  const result = {
    statusResponse: true,
    error: null,
    tags: [],
    startTags: null,
  };
  try {
    const response = await db
      .collection("UserTags")
      .orderBy("createdDate", "desc")
      .where("ownerId", "==", idCurrentUser)
      .startAfter(startTags.data().ownerId)
      .limit(limitTags)
      .get();

    if (response.docs.length > 0) {
      result.startTags = response.docs[response.docs.length - 1];
    }

    response.forEach((doc) => {
      const tag = doc.data();
      tag.id = doc.id;
      result.tags.push(tag);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
//YA
export const getAllTags = async (idCurrentUser) => {
  const result = { statusResponse: true, error: null, tags: [] };
  try {
    const tagsRef = collection(firestore, "UserTags");
    const q = query(tagsRef, where("ownerId", "==", idCurrentUser));
    const response = await getDocs(q);

    response.forEach((doc) => {
      const tag = doc.data();
      tag.id = doc.id;
      result.tags.push(tag);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

//YA
export const deleteDocument = async (collection, id) => {
  const result = {
    statusResponse: false,
    error: null,
  };

  try {
    const docRef = doc(firestore, collection, id);
    await deleteDoc(docRef);
    result.statusResponse = true;
  } catch (error) {
    result.error = error;
  }
  return result;
};
