import React from 'react'
import { ScrollView,Image } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Divider } from 'react-native-elements'
// import { useNavigation  }  from '@react-navigation/native'

export default function UserGuest({navigation}) {



    return (
       <ScrollView
            centerContent
            style={styles.mainViewScroll}
       >
           <Image 
                source={require("../../assets/Logo-Corazon.png")}
                resizeMode="contain"
                style={styles.imageLogo}
           />
           <Text style={styles.title}>Bienvenido a <Text style={styles.textName}>iCitas</Text> 
           </Text>
            <Text style={styles.description} >
                Administra tus citas y las de tus allegados de una manera simple.
                {"\n\n"}
                No olvidaras nunca mas una consulta al medico.
                {"\n\n"}
                Informa a tu familia y amigos sobre sus procedimientos médicos.
                {"\n\n"}
                <Text style={styles.textBold}>¡Lleva el control de tu salud!</Text>
            </Text>
            <Divider 
                style={styles.divider}
            />

            <View style={styles.container}>
    
                <Button 
                    title="Iniciar Sesión"
                    containerStyle ={styles.btnContainer}
                    buttonStyle = {styles.btnLogin}
                    onPress={()=> navigation.navigate("login")}
                 />
                
                <Text 
                    style={styles.register}
                    onPress={() => navigation.navigate("register")}
                >
                    ¿Aun no tienes una cuenta?{" "}
                    <Text style={styles.btnRegister}>
                        Régistrate!
                    </Text>
                </Text>

            </View> 
          
       </ScrollView>
    )
}


const styles = StyleSheet.create({
    mainViewScroll:{
        marginHorizontal:30
    },
    imageLogo:{
        height: 300,
        width: "100%",
    },
    title:{
        fontWeight:"bold",
        fontSize: 19,
        marginVertical: 10,
        textAlign: "center"
    },
    textName:{
        fontWeight:"bold",
        fontSize: 21,
        marginVertical: 10,
        textAlign: "center",
        color: "#047ca4"
    },
    description:{
        textAlign: "center",
        marginBottom: 20
    },
    textBold:{
        fontWeight:"bold",
        fontSize: 15,
    },
    divider:{
        backgroundColor: "#047ca4",
        marginTop: 10
    },
    

    container: {
        flex: 1,
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    btnContainer:{
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    },
    btnLogin:{
        backgroundColor: "#047ca4"
    },
    register:{
        marginTop:15,
        marginHorizontal:10,
        alignSelf: "center"
    },
    btnRegister:{
        color: "#047ca4",
        fontWeight: "bold"
    }
    
})
