import { size } from 'lodash'
import React, { useState } from 'react'
import { Image } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Input,Icon, Divider, Button } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {validateEmail} from '../../utils/helpers'
import {registerUser,loginWithEmailAndPassword} from '../../utils/actions'
import Loading from '../Loading'

export default function Register({setLogueado}) {

    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const onChange =(e, type) =>{
        setFormData({...formData, [type]: e.nativeEvent.text}) /* Para que el JSON sea dinamico se envuelve en corchete, el type */
    }


    const onSubmit = async() =>{ //metodo asincrono

        if(!validateData()){
            return;
        }

        setLoading(true)
        const resultRegister = await registerUser(formData.email,formData.password)
        
        if(!resultRegister.statusResponse){
            setErrorEmail(resultRegister.error)
            return
        }

        const resultLogin = await loginWithEmailAndPassword(formData.email,formData.password)
        setLoading(false)

        if(!resultLogin.statusResponse){
            setErrorEmail(resultRegister.error)
            return
        }

        setLogueado(true) //Para que recargue la pantalla una vez se actualice el nombre
        
    }

    const validateData = () =>{
        setErrorConfirmPassword("")
        setErrorEmail("")
        setErrorPassword("")

        let isValid = true

        if(!validateEmail(formData.email)){
            setErrorEmail("Debes de ingresar un email valido.")
            isValid = false
        }

        if(size(formData.password)<6){
            setErrorPassword("Debes ingresar una contraseña de al menos seis caracteres.")
            isValid = false
        }

        if(size(formData.confirmPassword)<6){
            setErrorConfirm("Debes ingresar una confirmación de contraseña de al menos seis caracteres.")
            isValid = false
        }

        if(formData.password !== formData.confirmPassword){
            setErrorPassword("La contraseña y la confirmacion no son iguales")
            setErrorConfirmPassword("La contraseña y la confirmacion no son iguales")
            isValid = false
        }
        return isValid
    }


    return (
        <KeyboardAwareScrollView>
            <Image
                source={require("../../assets/Logo-Corazon.png")}           
                resizeMode= "contain"
                style={styles.image} 
            />
            <View style={styles.formView}>
                <Input 
                    containerStyle={styles.input}
                    placeholder ="correo@direccion.com"
                    onChange={(e) => onChange(e,"email")}  
                    keyboardType= "email-address"
                    errorMessage ={errorEmail} 
                    defaultValue ={formData.email}    
                    label ="Correo electronico"  
                    leftIcon={
                        <Icon
                            type="font-awesome"
                            name ="envelope"
                            iconStyle={styles.icon}
                        />
                    } 
                />
                <Input 
                    containerStyle={styles.input}
                    placeholder ="Contraseña"
                    onChange={(e) => onChange(e,"password")}
                    errorMessage ={errorPassword} 
                    defaultValue ={formData.password}    
                    password={true}
                    secureTextEntry={!showPassword}
                    rightIcon ={
                                <Icon 
                                    type="font-awesome"
                                    name ={ showPassword ? "eye-slash" : "eye"}
                                    iconStyle={styles.icon}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                    }
                    label ="Contraseña"
                    leftIcon={
                        <Icon
                            type="font-awesome"
                            name ="lock"
                            iconStyle={styles.icon}
                        />
                    } 
                />
                <Input 
                    containerStyle={styles.input}
                    placeholder ="Confirma tu contraseña"
                    onChange={(e) => onChange(e,"confirmPassword")}
                    errorMessage ={errorConfirmPassword} 
                    defaultValue ={formData.confirmPassword}    
                    password={true}
                    secureTextEntry={!showPassword}
                    rightIcon ={
                                <Icon 
                                    type="font-awesome"
                                    name ={ showPassword ? "eye-slash" : "eye"}
                                    iconStyle={styles.icon}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                    }
                    label ="Confirmación"
                    leftIcon={
                        <Icon
                            type="font-awesome"
                            name ="lock"
                            iconStyle={styles.icon}
                        />
                    } 
                />

                <Button 
                    title="Crear Cuenta"
                    containerStyle ={styles.btnContainer}
                    buttonStyle = {styles.btnRegister}
                    onPress ={() => onSubmit()}
                 />
                <Loading isVisible={loading} text="Creando Cuenta" />
            </View>

        </KeyboardAwareScrollView>
    )
}

const defaultFormValues =() =>{
    return { email: "", password: "", confirmPassword: ""}
}


const styles = StyleSheet.create({
    image:{
        height: 230, 
        width: "100%",
        marginBottom: 10
    },

    formView:{
        marginTop: 20,
    },
    input:{
        width: "100%"
    },
    icon:{
        color: "#c1c1c1",
        marginRight: 5
    },
    btnContainer:{
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    },
    btnRegister:{
        backgroundColor: "#047ca4"
    },
})
