import React, { useState,useRef } from 'react'
import { isEmpty, size } from 'lodash';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity } from 'react-native'
import {  Icon, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast'

import { updateProfile,reauthenticateFirebase,updateEmailFirebase,updatePasswordFirebase } from '../../utils/actions';
import {validateEmail} from '../../utils/helpers'
import Loading from '../Loading';

const screen = Dimensions.get("window")

export default function DisplayNameForm({typeField,valueField,setReloadUser,setShowModalInfo,toasRef}) {


    switch (typeField) {
        case "displayName":
             return(
                <UpdateName valueField={valueField} setReloadUser={setReloadUser} setShowModalInfo={setShowModalInfo}/>    
             )
            break;
        case "numberIdentify":
            // dataProperties ={
            //     title: "Modificar Nro. Documento",
            //     value: valueField
            // }
            return (
                <View></View>
            )
            break;
        case "email":
            return (
                <UpdateEmail valueField={valueField} setReloadUser={setReloadUser} setShowModalInfo={setShowModalInfo}/>
            )
            break;
        case "phoneNumber":
            // dataProperties ={
            //     title: "Modificar Nro, Telefonico.",
            //     value: valueField
            // }
            return (
                <View></View>
            )
            break;
        case "password":
        // dataProperties ={
        //     title: "Modificar Nro, Telefonico.",
        //     value: valueField
        // }
        return (
            <UpdatePassWord setShowModalInfo={setShowModalInfo} toasRef={toasRef}/>
        )
            break;
    }


}

function UpdateName({valueField,setReloadUser,setShowModalInfo}){
    const [newName, setNewName] = useState(valueField)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    

    const onSubmit = async() =>{

        if(!validateForm()){
            return
        }

        setLoading(true)     
        const result = await updateProfile({displayName: newName})    
        setLoading(false)

        if(!result.statusResponse){
            setError("Error al actulizar nombres y apellidos, intenta mas tarde.")
            return
        }
        setReloadUser(true)
        setShowModalInfo(false)

    }

    const validateForm =() =>{
        setError(null)

        if(isEmpty(newName)){
            setError("Debes ingresar nombres y apellidos.")
            return false
        }
        if(newName === valueField){ 
            setError("Debes ingresar nombres y apellidos diferentes a los actuales.")
            return false
        }
        return true
    }

    return(
        <View style={styles.view}>
            <Text style={styles.textTitle}>
                Modificar Nombre
            </Text>
            <Input 
                placeholder="Ingresa nombres y apellidos"
                containerStyle={styles.input}
                defaultValue ={valueField} 
                onChange={(e) => setNewName(e.nativeEvent.text)}
                errorMessage={error}
                label="Nombre"
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="user-circle"
                        iconStyle={styles.icon}
                    />
                }
            />
        
            <TouchableOpacity 
                style={styles.btnSave}
                onPress={onSubmit}
            >
                <Text style={styles.textSave}>
                    Guardar
                </Text>
            </TouchableOpacity>
            <Loading isVisible={loading} text={"Actualizando Nombre..."} />
        </View>
    )
}

function UpdateEmail({valueField,setReloadUser,setShowModalInfo}){
    const [showPassword, setShowPassword] = useState(false)
    const [newEmail, setNewEmail] = useState(valueField)
    const [currentPassword, setCurrentPassword] = useState(null)

    const [errorEmail, setErrorEmail] = useState(null)
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() =>{

        if(!validateForm()){
            return
        }
        
        setLoading(true)
        const resultReauthenticate = await reauthenticateFirebase(currentPassword)

        if(!resultReauthenticate.statusResponse){
            setErrorCurrentPassword("Contraseña incorrecta.")
            setLoading(false)
            return
        }

        const resultupdateEmail = await updateEmailFirebase(newEmail) 
        setLoading(false)

        if(!resultupdateEmail.statusResponse){
            setErrorEmail("No se pudo cambiar por este correo, ya se encuentra en uso.")
            return
        }

        setReloadUser(true)
        setShowModalInfo(false)

    }

    const validateForm = () =>{
        setErrorEmail(null)
        setErrorCurrentPassword(null)
        let isValid = true

        if(!validateEmail(newEmail)){ //Valida si es correcto o valido
            setErrorEmail("Debes ingresar un email valido.")
            isValid = false
        }

        if(newEmail === valueField){ //Si nombre que ingreso es igual al nombre actual
            setErrorEmail("Debes ingresar un email diferente al actual.")
            isValid = false
        }

        if(isEmpty(currentPassword)){ 
            setErrorCurrentPassword("Debes ingresar tu contraseña.")
            isValid = false
        }

        return isValid

    }

    return(
        <View style={styles.view}>
            <Text style={styles.textTitle}>
                Modificar Correo
            </Text>
            <Input 
                placeholder="Ingresa nuevo correo..."
                containerStyle={styles.input}
                defaultValue ={valueField} 
                keyboardType="email-address"
                onChange={(e) => setNewEmail(e.nativeEvent.text)}
                errorMessage={errorEmail}
                label="Correo"
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="envelope"
                        iconStyle={styles.icon}
                    />
                }
            />
            <Input 
                placeholder="Contraseña actual..."
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword} 
                onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
                errorMessage={errorCurrentPassword}
                label="Contraseña Actual"
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="lock"
                        iconStyle={styles.icon}
                    />
                }
                rightIcon ={
                    <Icon 
                        type="font-awesome"
                        name ={ showPassword ? "eye-slash" : "eye"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }  
            />
            <View style={styles.button}>

            </View>
            <TouchableOpacity 
                style={styles.btnSave}
                onPress={onSubmit}
            >
                <Text style={styles.textSave}>
                    Guardar
                </Text>
            </TouchableOpacity>
            <Loading isVisible={loading} text={"Actualizando Correo..."} />
        </View>
    )
}

function UpdatePassWord({setShowModalInfo,toasRef}){
    const [currentPassword, setCurrentPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [confirmNewPassword, setConfirmNewPassword] = useState(null)

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null)
    const [errorNewPassword, setErrorNewPassword] = useState(null)
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState(null)

    const [loading, setLoading] = useState(false)


    const onSubmit = async() =>{
        if(!validateForm()){
            return
        }

        setLoading(true)
        const resultReauthenticate = await reauthenticateFirebase(currentPassword)  

        if(!resultReauthenticate.statusResponse){
            setErrorCurrentPassword("Contraseña incorrecta.")
            setLoading(false)
            return
        }

        const resultupdatePassword = await updatePasswordFirebase(newPassword) 
        setLoading(false)

        if(!resultupdatePassword.statusResponse){
            setErrorNewPassword("No se pudo actualizar la contraseña.")
            return
        }
        toasRef.current.show("Se ha actualizado la contraseña.",3000) 
        setShowModalInfo(false)
        
    }

    const validateForm = () =>{
        setErrorCurrentPassword(null)
        setErrorNewPassword(null)
        setErrorConfirmNewPassword(null)
        let isValid = true

        if(isEmpty(currentPassword)){ //Valida si es correcto o valido
            setErrorCurrentPassword("Debes ingresar tu contraseña actual.")
            isValid = false
        }

        
        if(size(newPassword) < 6){ 
            setErrorNewPassword("Debes ingresar una nueva contraseña de al menos 6 caracteres.")
            isValid = false
        }

        if(size(confirmNewPassword) < 6){ 
            setErrorConfirmNewPassword("Debes ingresar una confirmacion de contraseña igual a la contraseña.")
            isValid = false
        }

        if(newPassword !== confirmNewPassword){ 
            setErrorNewPassword("La contraseña y la confirmación deben coincidir.")
            setErrorConfirmNewPassword("La contraseña y la confirmación deben coincidir.")
            isValid = false
        }

        if(newPassword === currentPassword){
            setErrorCurrentPassword("Debes ingresar una contraseña diferente a la actual.")
            setErrorNewPassword("Debes ingresar una contraseña diferente a la actual.")
            setErrorConfirmNewPassword("Debes ingresar una contraseña diferente a la actual.")
            isValid = false
        }

        return isValid

    }

    return(
        <View style={styles.view}>
            <Text style={styles.textTitle}>
                Modificar Contraseña
            </Text>
            <Input 
                placeholder="Contraseña actual..."
                containerStyle={styles.input}
                defaultValue={currentPassword}
                onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
                errorMessage={errorCurrentPassword}
                password={true}
                secureTextEntry={!showCurrentPassword} 
                label="Contraseña Actual"
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="lock"
                        iconStyle={styles.icon}
                    />
                }
                rightIcon ={
                    <Icon 
                        type="font-awesome"
                        name ={ showCurrentPassword ? "eye-slash" : "eye"}
                        iconStyle={styles.icon}
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                }  
            />
           <Input 
                placeholder="Contraseña nueva..."
                containerStyle={styles.input}
                defaultValue={newPassword}
                onChange={(e) => setNewPassword(e.nativeEvent.text)}
                errorMessage={errorNewPassword}
                password={true}
                secureTextEntry={!showNewPassword} 
                label="Contraseña Nueva"
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="lock"
                        iconStyle={styles.icon}
                    />
                }
                rightIcon ={
                    <Icon 
                        type="font-awesome"
                        name ={ showNewPassword ? "eye-slash" : "eye"}
                        iconStyle={styles.icon}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    />
                }  
            />
            <Input 
                placeholder="Confirma tu nueva contraseña..."
                containerStyle={styles.input}
                defaultValue={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.nativeEvent.text)}
                errorMessage={errorConfirmNewPassword}
                password={true}
                secureTextEntry={!showConfirmNewPassword} 
                label="Confirmación"
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="lock"
                        iconStyle={styles.icon}
                    />
                }
                rightIcon ={
                    <Icon 
                        type="font-awesome"
                        name ={ showConfirmNewPassword ? "eye-slash" : "eye"}
                        iconStyle={styles.icon}
                        onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    />
                }  
            />
            <View style={styles.button}>

            </View>
            <TouchableOpacity 
                style={styles.btnSave}
                onPress={onSubmit}
            >
                <Text style={styles.textSave}>
                    Guardar
                </Text>
            </TouchableOpacity>
            <Loading isVisible={loading} text={"Actualizando Contraseña..."} />
        </View>
    )
}

const styles = StyleSheet.create({
    view:{
        paddingVertical: 10
    },
    input:{
        marginBottom: 10, //para que no se pegue el boton del input
    },
    btnContainer:{
        width: "95%"
    },
    btn:{
        backgroundColor: "#047ca4"
    },
    textTitle:{
        marginVertical:10,
        fontSize: 20,
        fontWeight: "bold",
        alignSelf:"center"
    },
    icon:{
        color: "#c1c1c1",
        marginRight: 5
    },

    btnSave:{
        width:"50%",
        height: 40,
        justifyContent: "center",
        alignItems:"center",
        alignSelf:"center",
        borderRadius: 10,
        backgroundColor: "#047ca4"
    },
    textSave:{
        color: "#FFFFFF",
        fontWeight: "bold"
    }
})
