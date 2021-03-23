import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Image, Input, SocialIcon,Divider } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { loginWithEmailAndPassword } from '../../utils/actions'

import { validateEmail } from '../../utils/helpers'
import Loading from '../Loading'

export default function Login({setLogged}) {
  
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

    const onChange =(e, type) =>{
        setFormData({...formData, [type]: e.nativeEvent.text}) /* Para que el JSON sea dinamico se envuelve en corchete, el type */
    }


    const onSubmit = async() =>{ 

        if(!validateData()){
            return;
        }
        setLoading(true)
        const resultLogin = await loginWithEmailAndPassword(formData.email,formData.password)

        if(!resultLogin.statusResponse){
            setErrorEmail(resultLogin.error)
            setLoading(false)
            return
        }
        setLoading(false)
       
        /*The Logged status is changed so that the user just logged in enters the TabNavigator */
        setLogged(true) 
    
    }

    const validateData = () =>{
        setErrorEmail("")
        setErrorPassword("")

        let isValid = true

        if(!validateEmail(formData.email)){
            setErrorEmail("Debes de ingresar un email valido.")
            isValid = false
        }

        if(isEmpty(formData.password)){
            setErrorPassword("Debes de ingresar tu contraseña.")
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
                

                <Button 
                    title="Iniciar"
                    containerStyle ={styles.btnContainer}
                    buttonStyle = {styles.btnRegister}
                    onPress ={() => onSubmit()}
                 />

                <View style={styles.optionsLoginText}>
                    <Divider  style={styles.divider}/>
                    <Text style={styles.textView}> O inicia sesión con </Text>
                    <Divider style={styles.divider}/>
                </View>
                     
                <View style={styles.socialIconView}>
                    <View style={styles.socialIcon}>
                        <SocialIcon
                            type="facebook"
                         />
                    </View>
                    <View style={styles.socialIcon}>
                        <SocialIcon
                            type="google"
                         />
                    </View>
                </View>
                <Loading isVisible={loading} text="Iniciando Sesión" />
            </View>

        </KeyboardAwareScrollView>
    )
}

const defaultFormValues =() =>{
    return { email: "", password: ""}
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
       
        width: "95%",
        alignSelf: "center"
    },
    btnRegister:{
        backgroundColor: "#047ca4",
       
    },
    socialIconView:{
        marginTop: 10,
        justifyContent: "center",
        flex: 1,
        flexDirection: "row" 
    },
    
    socialIcon:{
         flexDirection: "column"
    },
    optionsLoginText:{
        marginTop: 10,
        flex:1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    textView:{
        textAlign: "center"
    },
    divider:{
        backgroundColor: "#047ca4",
        height: 1,
        width: "20%"
    }
})
