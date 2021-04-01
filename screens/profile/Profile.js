import React,{useState, useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View,ScrollView,TouchableOpacity } from 'react-native'
import { Button, Image } from 'react-native-elements'

import { closeSession, getCurrentUser } from '../../utils/actions'
import UserLogged from './UserLogged'
import UserGuest from './UserGuest'
import Loading from '../../components/Loading'

export default function Profile({setLogged}) {
    
    const [login, setLogin] = useState(null)

    /*CADA QUE PASEMOS POR ACCOUNT VALIDARA SI ESTA LOGUEADO O NO */
    useFocusEffect(

        useCallback(() => {

            const user = getCurrentUser()
            user ? setLogin(true) : setLogin(false)
        }, [])

    )
    
    if(login == null){
        return <Loading isVisible={true} text="Cargando..." />
   }

   return login ? <UserLogged setLogged={setLogged}/> : <UserGuest />

    // return(
    //     <View>
    //         <ScrollView>
    //             <View style={styles.containerHeader}>
    //                 <UserImage photoURL={photoUrl}/>

                        
              
    //             </View>
                
    //         </ScrollView>
    //     </View>
    // )
    // return(
    //     <View>
    //         <Button
    //             title= "Cerrar Sesion"
    //             onPress={() =>{
    //                 closeSession()
    //                 setLogged(false)
    //             }}
    //         />
    //     </View>
    // )
}

function UserImage({photoURL}){
    console.log(photoURL)
    return(
        <View style={styles.containerImageProfile}>
            {/* <Image 
                source={
                    photoURL
                        ? {uri: photoURL}
                        : require("../../assets/avatar-default.jpg")
                    }
                    style={styles.imageProfile}
            /> */}
            <Avatar 
                rounded
                size="large"
                source={
                    photoURL
                        ? {uri: photoURL}
                        : require("../../assets/avatar-default.jpg")
                }
            />
                    {/* <Text style={styles.displayName}>
                        {
                            userInfo.displayName ? userInfo.displayName : "Anonimo"
                        }
                    </Text> */}
        </View>
    )
}


const styles = StyleSheet.create({
    containerHeader:{
        padding: 10,
        width: "100%",
        backgroundColor: "#047ca4",
        height: 150
    },
    containerImageProfile:{
        alignItems:"center"
    },
    imageProfile:{
        width: 140,
        height: 140,
        borderRadius:100,
        marginTop: -70
    },
    displayName:{
        fontSize: 25
    }
})
