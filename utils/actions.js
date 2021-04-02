import {firebaseApp} from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { fileToBlob } from './helpers'
import { LogBox} from 'react-native'

LogBox.ignoreAllLogs()
LogBox.ignoreLogs(["Setting a timer"])



const db = firebase.firestore(firebaseApp)

export const isUserLogged =() =>{

    let isLogged = false
    firebase.auth().onAuthStateChanged((user) =>{
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrentUser = () =>{
    return firebase.auth().currentUser
}

export const registerUser = async(email,password) =>{
    const result ={statusResponse: true, error: null}

    try {
        await firebase.auth().createUserWithEmailAndPassword(email,password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Este correo ya ha sido registrado."
    }
    
    return result
}

export const loginWithEmailAndPassword = async(email,password) =>{
    const result ={statusResponse: true, error: null}

    try {
        await firebase.auth().signInWithEmailAndPassword(email,password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña incorrectos."
    }
    
    return result
}

export const closeSession = () =>{
    return firebase.auth().signOut()
}

export const uploadImage = async(image,path,name) =>{
    const result = {statusResponse: false, error: null, url: null}
    const ref = firebase.storage().ref(path).child(name) 
    const blob = await fileToBlob(image)

    try {
        await ref.put(blob) 
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL() //Obteniendo la ruta de como quedo la imagen
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }

    return result
    
}
export const updateProfile = async(data) =>{
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().currentUser.updateProfile(data) //mandamos los datos de lo que queremos actualizar
    } 
    catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const reauthenticateFirebase = async(password) =>{
    const result = { statusResponse: true, error: null}
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email,password) //Para obtener las credenciales

    try {
        await user.reauthenticateWithCredential(credentials) //Para reautenticar
    } 
    catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updateEmailFirebase = async(newEmail) =>{
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().currentUser.updateEmail(newEmail) 
    } 
    catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updatePasswordFirebase = async(newPassword) =>{
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().currentUser.updatePassword(newPassword) 
    } 
    catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}