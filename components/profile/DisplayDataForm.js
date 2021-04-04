import React, { useState } from 'react'
import { isEmpty, size } from 'lodash';
import { StyleSheet, Text, View,Dimensions,TouchableOpacity } from 'react-native'
import {  Icon, Input } from 'react-native-elements';
import CountryPicker from 'react-native-country-picker-modal'


import { updateProfile,reauthenticateFirebase,updateEmailFirebase,updatePasswordFirebase,updatePhoneFirebase, updateDocument } from '../../utils/actions';
import {getCountryCode, validateEmail} from '../../utils/helpers'
import Loading from '../Loading';



export default function DisplayNameForm({typeField,valueField,setReloadUser,setShowModalInfo,toasRef,uidUser,setReloadInfoExternal}) {




    switch (typeField) {
        case "displayName":
             return(
                <UpdateName 
                    valueField={valueField} 
                    setReloadUser={setReloadUser} 
                    setShowModalInfo={setShowModalInfo} 
                    uidUser={uidUser}
                />    
             )
            break;
        case "numberIdentify":
            return (
                <UpdateNumberIdentify 
                    valueField={valueField} 
                    setReloadInfoExternal={setReloadInfoExternal}
                    setShowModalInfo={setShowModalInfo}
                    uidUser={uidUser}
                />
            )
            break;
        case "email":
            return (
                <UpdateEmail 
                    valueField={valueField} 
                    setReloadUser={setReloadUser} 
                    setShowModalInfo={setShowModalInfo} 
                    uidUser={uidUser}
                    />
            )
            break;
        case "phoneNumber":

            return (
                <UpdatePhone 
                    valueField={valueField} 
                    setReloadInfoExternal={setReloadInfoExternal}
                    setShowModalInfo={setShowModalInfo}
                    uidUser={uidUser}
                />
            )
            break;
        case "password":

            return (
                <UpdatePassWord 
                    setShowModalInfo={setShowModalInfo} 
                    toasRef={toasRef}
                />
            )
            break;
    }


}

function UpdateName({valueField,setReloadUser,setShowModalInfo,uidUser}){
    const [newName, setNewName] = useState(valueField)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() =>{

        if(!validateForm()){
            return
        }

        setLoading(true)     
        const result = await updateProfile({displayName: newName})    

        const resultCollection = await updateDocument("Users",uidUser,{name: newName})

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

function UpdateEmail({valueField,setReloadUser,setShowModalInfo,uidUser}){
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
        const resultCollection = await updateDocument("Users",uidUser,{email: newEmail})
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

function UpdatePhone({valueField,setReloadInfoExternal,setShowModalInfo,uidUser}){
    
    /*The valueField field for the phone brings a string of callingCode and phoneNumber separated by _*/
    const initialCallingCode = valueField ? valueField.split("_")[0] : "57"
    const initialPhone= valueField ? valueField.split("_")[1] : "CO"

    const [callingCode, setCallingCode] = useState(initialCallingCode)
    const [phone, setPhone] = useState(initialPhone) 

    const [country, setCountry] = useState(getCountryCode(initialCallingCode))

    const [errorPhone, setErrorPhone] = useState(null)
    const [loading, setLoading] = useState(false)


    const onSubmit = async() =>{
        if(!validateForm()){
            return
        }

        const userData ={
            callingCode : callingCode,
            phoneNumber: phone
        }
        
        setLoading(true)
        const resultCollection = await updateDocument("Users",uidUser,userData)
        if(!resultCollection.statusResponse){
            setErrorPhone("Error al actualizar el numero.")
            setLoading(false)
            return
        }
        setLoading(false)

        setReloadInfoExternal(true)
        setShowModalInfo(false)
        
        

    }

    const validateForm = () =>{
        setErrorPhone(null)
        let isValid = true

        if(size(phone)<10){
            setErrorPhone("Debes ingresar un numero valido")
            isValid = false
        }

        return isValid
    }

    return(
        <View style={styles.view}>
                <Text style={styles.textTitle}>
                    Modificar Telefono
                </Text>
                <View style={styles.viewPhone}>
                    <View style={styles.viewCountry}> 

                        <CountryPicker
                            withFlag
                            withCallingCode
                            withFilter
                            withCallingCodeButton
                            countryCode={country}
                            containerStyle={styles.countryPickerStyle}
                            callingCode={callingCode}
                            onSelect= {(country) =>{
                                setCountry(country.cca2)
                                setCallingCode(country.callingCode[0])
                                

                            }}
                        />
                    </View>
                    
                    <Input 
                        placeholder="Numero celular..."
                        defaultValue={phone}
                        keyboardType="phone-pad"
                        containerStyle={styles.inputPhone}
                        onChange={(e) => setPhone(e.nativeEvent.text)}
                        errorMessage={errorPhone}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.btnSave}
                    onPress={onSubmit}
                >
                    <Text style={styles.textSave}>
                        Guardar
                    </Text>
                </TouchableOpacity>
                <Loading isVisible={loading} text={"Actualizando Numero..."} />
        </View>
    )
        
}

function UpdateNumberIdentify({valueField,setReloadInfoExternal,setShowModalInfo,uidUser}){
    const [numberIdentify, setNumberIdentify] = useState(valueField)
    const [errorNumberIdentify, setErrorNumberIdentify] = useState(null)
    const [loading, setLoading] = useState(false)


    const onSubmit = async() =>{
        if(!validateForm()){
            return
        }
        
        setLoading(true)
        const resultCollection = await updateDocument("Users",uidUser,{numberIdentify: numberIdentify})
        if(!resultCollection.statusResponse){
            setErrorNumberIdentify("Error al actualizar el numero.")
            setLoading(false)
            return
        }
        setLoading(false)
        setReloadInfoExternal(true)
        setShowModalInfo(false)
        
    
    }

    const validateForm = () =>{
        setErrorNumberIdentify(null)
        let isValid = true

        if(isEmpty(numberIdentify)){
            setErrorNumberIdentify("Debes ingresar tu numero de identificación.")
            isValid = false
        }

        return isValid
    }

    return(
        <View style={styles.view}>
            <Text style={styles.textTitle}>
                Modificar Identificación
            </Text>
            <Input 
                placeholder="Ingresa tu numero de identidad."
                containerStyle={styles.input}
                defaultValue ={valueField} 
                keyboardType="number-pad"
                onChange={(e) => setNumberIdentify(e.nativeEvent.text)}
                errorMessage={errorNumberIdentify}
                label="Nro. Identidad"
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="id-badge"
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
            <Loading isVisible={loading} text={"Actualizando Numero..."} />
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
    },
    viewPhone:{
        flexDirection:"row",
        
    },
    countryPickerStyle:{
        alignItems:"center",
        marginTop: 10
    },
    viewCountry:{
        marginVertical:7
    },
    inputPhone:{
        marginBottom: 10, //para que no se pegue el boton del input
        width:"80%"
    }
})
