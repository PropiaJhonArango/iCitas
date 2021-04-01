import { isEmpty } from 'lodash';
import React, { useState } from 'react'
import { StyleSheet, Text, View,Dimensions,TouchableOpacity } from 'react-native'
import {  Icon, Input } from 'react-native-elements';

import { updateProfile } from '../../utils/actions';
import Loading from '../Loading';

const screen = Dimensions.get("window")

export default function DisplayNameForm({typeField,valueField,setReloadUser,setShowModalInfo}) {


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
            // dataProperties ={
            //     title: "Modificar CorreoElectronico",
            //     value: valueField
            // }
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

function UpdateEmail({valueField}){
    return(
        <View style={styles.view}>
            <Text style={styles.textTitle}>
                Modificar Correo
            </Text>
            <Input 
                placeholder="Ingresa correo electronico."
                containerStyle={styles.input}
                defaultValue ={valueField} 
                leftIcon={
                    <Icon
                        type="font-awesome"
                        name ="envelope"
                        iconStyle={styles.icon}
                    />
                }
            />
            <View style={styles.button}>

            </View>
            <TouchableOpacity 
                style={styles.btnSave}
            >
                <Text style={styles.textSave}>
                    Guardar
                </Text>
            </TouchableOpacity>
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
