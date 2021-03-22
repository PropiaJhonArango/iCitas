import React from 'react'
import { ScrollView,Image } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Divider } from 'react-native-elements'
import { useNavigation  }  from '@react-navigation/native'

export default function UserGuest() {

    const navigation = useNavigation()

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
                <View style={styles.buttonsContainer}>
                     <Button
                        title ="Iniciar Sesión"
                        onPress={()=> navigation.navigate("login")}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                     <Button
                        title ="Registrate"
                        onPress={()=> console.log("Click en Registrarse")}
                    />
                </View>
                
            
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
      },
      buttonsContainer: {
        flex: 1,
        margin: 10
      }
    
})
