import React from 'react'
import { ScrollView,Image,Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient';


export default function UserGuest({navigation}) {

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="light-content"
            />
            
            <View style={styles.header}>
                 <Animatable.Image 
                    animation="pulse"
                    easing="ease-out"
                    iterationCount="infinite"
                    source ={require('../../assets/Logo-Corazon_Borde.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <Animatable.View 
                style={styles.footer}
                animation="fadeInUpBig"
            >
                <Text style={styles.title}>Bienvenido s <Text style={styles.textName}>iCitas</Text>  </Text>

                <Text style={styles.description} >
                Administra tus citas y las de tus allegados de una manera simple.
                </Text>
                <View style={styles.viewButtons}>

                    <View style={styles.buttonLogIn}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("login")}
                        >

                            <LinearGradient
                                colors={["#067da4","#067da4"]}
                                style={styles.logIn}
                            >
                                <Text style={styles.textLogIn}>Iniciar Sesion</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonSingIn}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("register")}
                            
                        >
                            <LinearGradient
                                colors={["#067da4","#067da4"]}
                                style={styles.SingIn}
                            >
                                <Text style={styles.textSingIn}>Registrate</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>



            </Animatable.View>
            
        </View>
    )
     
}


const {height} = Dimensions.get("screen")
const height_logo = height * 0.7 * 0.4


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#047ca4",
    },
    header:{
        flex:2,
        justifyContent: "center",
        alignItems:"center"
    },
    footer:{
        flex:1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:50,
        paddingHorizontal: 30
    },
    logo:{
        width:height_logo,
        height: height_logo
    },
    title:{
        color: "black",
       fontWeight: "bold",
       fontSize:25,
       textAlign: "center"
    },
    textName:{
        fontWeight:"bold",
        fontSize: 27,
        textAlign: "center",
        color: "#047ca4"
    },
    viewButtons:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        flexDirection:"row",
        justifyContent: "space-between"
    },
    buttonLogIn:{
        alignItems :"flex-start"
        
    },
    logIn:{
        width:150,
        height: 40,
        justifyContent: "center",
        borderRadius: 50,
        flexDirection:"row",
        alignItems:"center"
    },
    textLogIn:{
        color:"white",
        fontWeight: "bold"
    },
    buttonSingIn:{
        alignItems :"flex-end",
    },
    SingIn:{
        width:150,
        height: 40,
        justifyContent: "center",
        borderRadius: 50,
        flexDirection:"row",
        alignItems:"center"
    },
    textSingIn:{
        color:"white",
        fontWeight: "bold"
    },
    description:{
        marginTop: 25,
        fontSize:15,
        justifyContent: "flex-start"
    },

})



// import React from 'react'
// import { ScrollView,Image } from 'react-native'
// import { StyleSheet, Text, View } from 'react-native'
// import { Button, Divider } from 'react-native-elements'
// // import { useNavigation  }  from '@react-navigation/native'

// export default function UserGuest({navigation}) {



//     return (
//        <ScrollView
//             centerContent
//             style={styles.mainViewScroll}
//        >
//            <Image 
//                 source={require("../../assets/Logo-Corazon.png")}
//                 resizeMode="contain"
//                 style={styles.imageLogo}
//            />
//            <Text style={styles.title}>Bienvenido a <Text style={styles.textName}>iCitas</Text> 
//            </Text>
//             <Text style={styles.description} >
//                 Administra tus citas y las de tus allegados de una manera simple.
//                 {"\n\n"}
//                 No olvidaras nunca mas una consulta al medico.
//                 {"\n\n"}
//                 Informa a tu familia y amigos sobre sus procedimientos médicos.
//                 {"\n\n"}
//                 <Text style={styles.textBold}>¡Lleva el control de tu salud!</Text>
//             </Text>
//             <Divider 
//                 style={styles.divider}
//             />

//             <View style={styles.container}>
    
//                 <Button 
//                     title="Iniciar Sesión"
//                     containerStyle ={styles.btnContainer}
//                     buttonStyle = {styles.btnLogin}
//                     onPress={()=> navigation.navigate("login")}
//                  />
                
//                 <Text 
//                     style={styles.register}
//                     onPress={() => navigation.navigate("register")}
//                 >
//                     ¿Aun no tienes una cuenta?{" "}
//                     <Text style={styles.btnRegister}>
//                         Régistrate!
//                     </Text>
//                 </Text>

//             </View> 
          
//        </ScrollView>
//     )
// }


// const styles = StyleSheet.create({
//     mainViewScroll:{
//         marginHorizontal:30
//     },
//     imageLogo:{
//         height: 300,
//         width: "100%",
//     },
//     title:{
//         fontWeight:"bold",
//         fontSize: 19,
//         marginVertical: 10,
//         textAlign: "center"
//     },
//     textName:{
//         fontWeight:"bold",
//         fontSize: 21,
//         marginVertical: 10,
//         textAlign: "center",
//         color: "#047ca4"
//     },
//     description:{
//         textAlign: "center",
//         marginBottom: 20
//     },
//     textBold:{
//         fontWeight:"bold",
//         fontSize: 15,
//     },
//     divider:{
//         backgroundColor: "#047ca4",
//         marginTop: 10
//     },
    

//     container: {
//         flex: 1,
//         // flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 20
//     },
//     btnContainer:{
//         marginTop: 20,
//         width: "95%",
//         alignSelf: "center"
//     },
//     btnLogin:{
//         backgroundColor: "#047ca4"
//     },
//     register:{
//         marginTop:15,
//         marginHorizontal:10,
//         alignSelf: "center"
//     },
//     btnRegister:{
//         color: "#047ca4",
//         fontWeight: "bold"
//     }
    
// })
