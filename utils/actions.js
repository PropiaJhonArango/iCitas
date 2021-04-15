import {firebaseApp} from './firebase'
import * as firebase from 'firebase'
import { fileToBlob } from './helpers'
import { LogBox} from 'react-native'
import { size } from 'lodash'

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
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
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
        await firebase.auth().currentUser.updateProfile(data) 
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
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email,password)

    try {
        await user.reauthenticateWithCredential(credentials) 
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

export const addDocumentWithId = async(collection,data) =>{
    const result = { statusResponse: true, error: null}
    try {
        await db.collection(collection).doc(data.uidUser).set(data) 
    } 
    catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const addDocumentWithoutId = async(collection,data) =>{
    const result = { statusResponse: true, error: null}
    try {
        await db.collection(collection).add(data)
    } 
    catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const  updateDocument = async(collection,id,data) => {
    const result ={
        statusResponse : false,
        error : null
    }

    try {
        await db.collection(collection).doc(id).update(data)
        result.statusResponse=true
    } catch (error) {
        result.error = error
    }

    return result
}

export const getCollectionWithId =  async(collection,id) =>{
    const result = {
        statusResponse: false,
        data: null,
        error: null
    }

    try {
        const data = await db.collection(collection).doc(id).get()
        const arrayData = data.data()
        arrayData.id = data.id
        result.statusResponse = true
        result.data = arrayData
    } catch (error) {
        result.error = error
    }

    return result
}

export const getAppointments = async(limitAppointments) => {
    const result = { statusResponse : true, error: null, appointments: [], startAppointment: null}
    try {
        const response = await db
                .collection("Appointments")
                .orderBy("dateAndTime", "asc")
                .where("dateAndTime", ">=", new Date())
                .limit(limitAppointments).get()
        if(response.docs.length > 0){
            result.startAppointment = response.docs[response.docs.length-1]
        }
        response.forEach(doc => {
            const appointment = doc.data()
            appointment.id = doc.id
            result.appointments.push(appointment)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }

    return result 
}

export const getMoreAppointments = async(limitAppointments, startAppointment) => {
    const result = { statusResponse : true, error: null, appointments: [], startAppointment: null}
    try {
        const response = await db
            .collection("Appointments")
            .orderBy("dateAndTime", "asc")
            .where("dateAndTime", ">=", new Date())
            .startAfter(startAppointment.data().dateAndTime)
            .limit(limitAppointments)
            .get()
        if(response.docs.length > 0){
            result.startAppointment = response.docs[response.docs.length-1]
        }
        response.forEach(doc => {
            const appointment = doc.data()
            appointment.id = doc.id
            result.appointments.push(appointment)
            
        });
    } catch (error) {
        
        result.statusResponse = false
        result.error = error
    }

    return result 
}

export const getAppointmentsExpired = async(limitAppointments) => {
    const result = { statusResponse : true, error: null, appointments: [],startAppointment: null}
    try {

        const response = await db
        .collection("Appointments")
        .orderBy("dateAndTime", "desc")
        .where("dateAndTime", "<", new Date())
        .limit(limitAppointments)
        .get()
        
        if(response.docs.length > 0){
            result.startAppointment = response.docs[response.docs.length-1]
        }
        response.forEach(doc => {
            const appointment = doc.data()
            appointment.id = doc.id
            result.appointments.push(appointment)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}

export const getMoreAppointmentsExpired = async(limitAppointments, startAppointment) => {
    const result = { statusResponse : true, error: null, appointments: [], startAppointment: null}
    try {

        const response = await db
        .collection("Appointments")
        .orderBy("dateAndTime", "desc")
        .where("dateAndTime", "<", new Date())
        .startAfter(startAppointment.data().dateAndTime)
        .limit(limitAppointments)
        .get()
        
        if(response.docs.length > 0){
            result.startAppointment = response.docs[response.docs.length-1]
        }
        
        response.forEach(doc => {
            const appointment = doc.data()
            appointment.id = doc.id
            result.appointments.push(appointment)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}

export const getSocialGroup = async(limitSocialGroup,idCurrentUser) => {
    const result = { statusResponse : true, error: null, socialGroup: [], startSocialGroup: null}
    try {
        const response = await db
                .collection("SocialGroup")
                .where("idMainUser", "==", idCurrentUser)
                .limit(limitSocialGroup)
                .get()
        if(response.docs.length > 0){
            result.startSocialGroup = response.docs[response.docs.length-1]
        }
        response.forEach(doc => {
            const social = doc.data()
            social.id = doc.id
            result.socialGroup.push(social)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}

export const getMoreSocialGroup = async(limitSocialGroup,idCurrentUser,startSocialGroup) => {
    const result = { statusResponse : true, error: null, socialGroup: [], startSocialGroup: null}
    try {

        const response = await db
        .collection("SocialGroup")
        .orderBy("createdDate", "desc")
        .where("idMainUser", "==", idCurrentUser)
        .startAfter(startSocialGroup.data().idMainUser)
        .limit(limitSocialGroup)
        .get()
        
        if(response.docs.length > 0){
            result.startSocialGroup = response.docs[response.docs.length-1]
        }
        
        response.forEach(doc => {
            const social = doc.data()
            social.id = doc.id
            result.socialGroup.push(social)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}

export const getAllSocialGroup = async(idCurrentUser) => {
    const result = { statusResponse : true, error: null, socialGroup: []}
    try {
        const response = await db
                .collection("SocialGroup")
                .where("idMainUser", "==", idCurrentUser)
                .get()

        response.forEach(doc => {
            const social = doc.data()
            social.id = doc.id
            result.socialGroup.push(social)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}

export const getTags = async(limitTags,idCurrentUser) => {
    const result = { statusResponse : true, error: null, tags: [], startTags: null}
    try {
        const response = await db
                .collection("UserTags")
                .where("ownerId", "==", idCurrentUser)
                .limit(limitTags)
                .get()
        if(response.docs.length > 0){
            result.startTags = response.docs[response.docs.length-1]
        }
        response.forEach(doc => {
            const tag = doc.data()
            tag.id = doc.id
            result.tags.push(tag)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}

export const getMoreTags = async(limitTags,idCurrentUser,startTags) => {
    const result = { statusResponse : true, error: null, tags: [], startTags: null}
    try {

        const response = await db
        .collection("UserTags")
        .orderBy("createdDate", "desc")
        .where("ownerId", "==", idCurrentUser)
        .startAfter(startTags.data().ownerId)
        .limit(limitTags)
        .get()
        
        if(response.docs.length > 0){
            result.startTags = response.docs[response.docs.length-1]
        }
        
        response.forEach(doc => {
            const tag = doc.data()
            tag.id = doc.id
            result.tags.push(tag)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}

export const getAllTags = async(idCurrentUser) => {
    const result = { statusResponse : true, error: null, tags: []}
    try {
        const response = await db
                .collection("UserTags")
                .where("ownerId", "==", idCurrentUser)
                .get()

        response.forEach(doc => {
            const tag = doc.data()
            tag.id = doc.id
            result.tags.push(tag)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}