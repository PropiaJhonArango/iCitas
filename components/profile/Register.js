import { size } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { Input,Icon } from 'react-native-elements'
import * as Animatable from 'react-native-animatable'

import {validateEmail} from '../../utils/helpers'
import {registerUser,loginWithEmailAndPassword} from '../../utils/actions'
import Loading from '../Loading'


export default function Register({setLogged}) {

    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const onChange =(e, type) =>{
        setFormData({...formData, [type]: e.nativeEvent.text}) 

    }


    const onSubmit = async() =>{ 

        if(!validateData()){
            return;
        }

        setLoading(true)
        const resultRegister = await registerUser(formData.email,formData.password)
        
        if(!resultRegister.statusResponse){
            setErrorEmail(resultRegister.error)
            setLoading(false)
            return
        }

        const resultLogin = await loginWithEmailAndPassword(formData.email,formData.password)
        setLoading(false)

        if(!resultLogin.statusResponse){
            setErrorEmail(resultRegister.error)
            return
        }

        /*The Logged status is changed so that the user just logged in enters the TabNavigator */
        setLogged(true) 
        
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
        <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.text_header}>Registrate!</Text>
        </View>
        <Animatable.View 
            style={styles.footer} 
            animation="fadeInUpBig"
        >

            <View style={styles.action}>
                <Input 
                    style={styles.textInput}
                    placeholder= "Correo electronico...."
                    onChange={(e) => onChange(e,"email")}  
                    keyboardType= "email-address"
                    errorMessage ={errorEmail} 
                    defaultValue ={formData.email}   
                    label="E-mail"
                    leftIcon={
                        <Icon
                            type="font-awesome"
                            name ="envelope"
                            iconStyle={styles.icon}
                        />
                    }
                   
                />
                <Input 
                        style={styles.textInput}
                        placeholder= "Contraseña..."
                        onChange={(e) => onChange(e,"password")} 
                        errorMessage ={errorPassword} 
                        defaultValue ={formData.password}    
                        password={true}
                        secureTextEntry={!showPassword} 
                        label="Contraseña"
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
                <Input 
                        style={styles.textInput}
                        placeholder= "Confirma tu contraseña..."
                        onChange={(e) => onChange(e,"confirmPassword")} 
                        errorMessage ={errorConfirmPassword} 
                        defaultValue ={formData.confirmPassword}    
                        password={true}
                        secureTextEntry={!showConfirmPassword}
                        label="Confirma Contraseña"
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
                                name ={ showConfirmPassword ? "eye-slash" : "eye"}
                                iconStyle={styles.icon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        }   
                />
                
            </View>
        
            <View style={styles.button}>
                    
                    <TouchableOpacity 
                        style={styles.SingIn}
                        onPress ={() => onSubmit()}
                    >

                        <Text style={[styles.textSingIn,{
                            color: "#FFFFFF"
                        }]}>Crear Cuenta</Text>

                    
                    </TouchableOpacity>           
                </View>
                <Loading isVisible={loading} text="Creando Cuenta" />

        </Animatable.View>
       
        
    </View>
    )
}

const defaultFormValues =() =>{
    return { email: "", password: "", confirmPassword: ""}
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#047ca4",
    },
    header:{
        flex:1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer:{
        flex:2,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:30,
        paddingHorizontal: 20
    },
    text_header:{
        color:"#FFFFFF",
        fontWeight: "bold",
        fontSize: 30,
     
    },
    text_footer:{
        color: "#047ca4",
        fontSize: 18
    },
    action:{

        paddingBottom: 5
    },
    textInput:{
        flex:1,
        paddingLeft: 10,
        color: "#047ca4"
    },
    button:{
        flex:1,
        alignItems:"center",
    },
    SingIn:{
        width:"100%",
        height: 50,
        justifyContent: "center",
        alignItems:"center",
        borderRadius: 10,
        backgroundColor: "#067da4"
    },
    SingUp:{
        width:"100%",
        height: 50,
        justifyContent: "center",
        alignItems:"center",
        borderRadius: 10,
        borderColor: "#4dc2f8",
        borderWidth:1,
        marginTop:15
    },
    textSingIn:{
        fontSize:18,
        fontWeight: "bold",
        color: "#FFFFFF"
    },
    textSingUp:{
        fontSize:18,
        fontWeight: "bold",
        color: "#4dc2f8"
    },
    icon:{
        color: "#c1c1c1"
    },
    textForgotPassWord:{
        color:"#009bd1"
    }
})
