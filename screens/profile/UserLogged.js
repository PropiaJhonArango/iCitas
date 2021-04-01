import React,{useState,useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View,ScrollView,Alert,StyleSheet } from 'react-native'
import { Avatar, Icon,Image } from 'react-native-elements'

import { getCurrentUser,uploadImage,updateProfile } from '../../utils/actions'
import { loadImageFromGallery } from '../../utils/helpers'
import Loading from '../../components/Loading'


export default function UserLogged({setLogged}) {
    const [user, setUser] = useState(getCurrentUser())
    const [reloadUser, setReloadUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")

    useEffect(() => {
        setUser(getCurrentUser())
        setReloadUser(false)
    }, [reloadUser])


    return (
        <View>
            {
                user &&(
                    <View>
                        <Header user={user} setLoading={setLoading} setLoadingText={setLoadingText} setReloadUser={setReloadUser}/>
                        <AppointmentsStats user={user}/>
                        <PersonalInfo user={user}/>
                        <Loading isVisible={loading} text={loadingText} />
                    </View>

                )
            }
            
        </View>
    )
}

function Header({user,setLoading, setLoadingText}){
    const [photoUrl, setPhotoUrl] = useState(user.photoURL) 

    const updateProfilePhoto = async() =>{

        const resultImageSelected = await loadImageFromGallery([1,1])

        if(!resultImageSelected.status){
            return
        }
 
        setLoadingText("Actualizando foto de perfil.")
        setLoading(true)
        const resultUploadImage = await uploadImage(resultImageSelected.image,"avatars",user.uid)


        if(!resultUploadImage.statusResponse){
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }

        const resultUpdateProfile = await updateProfile({photoURL: resultUploadImage.url})

        setLoading(false)
        if(resultUpdateProfile.statusResponse){
            setPhotoUrl(resultUploadImage.url)
            
        }else{
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }

    return(
    <LinearGradient
            colors={["#047ca4","#047ca4"]}
            start={[0,0]}
            end={[1,1]}
        >

            <View style={styles.containerHeader}>
                <View>

                    <View style={styles.rowBeetween}>
                        <Icon 
                            type="font-awesome"
                            name="ellipsis-v"
                            iconStyle={styles.iconPoints}
                            
                        />
 
                    </View>
                    <View style={styles.imageContainer}>
                        <View>
                            <View style={styles.check}>
                                <Icon 
                                    type="font-awesome"
                                    name="camera"
                                    onPress={updateProfilePhoto}
                                />
                            </View>
                            <Image 
                                source={
                                    photoUrl
                                    ? {uri: photoUrl}
                                    : require("../../assets/avatar-default.jpg")
                                }
                                style={styles.profilePhoto}
                                onPress={updateProfilePhoto}
                            />
                           
                        </View>
                    </View>
                    <View style={styles.viewTitle}>
                        <Text style={styles.titleName}> 
                            {
                                user.displayName ? user.displayName : "Anonimo"
                            }
                        </Text>
                    </View>
                </View>          
            </View>
        </LinearGradient>
    )
}

function PersonalInfo({user}){
    return(
        <View>
            
            <View style={styles.viewPersonalInfoContainer}>
                <View style={styles.viewPersonalInfo}>
                    
                    <Icon
                        type="font-awesome"
                        name="user-circle"
                        iconStyle={styles.iconPersonalInfo}
                        size={30}
                    />
                </View>
                <Text>
                    {
                        user.displayName ? user.displayName : "Nombre Completo"
                    }
                </Text>

            </View>
            <View style={styles.viewPersonalInfoContainer}>
                <View style={styles.viewPersonalInfo}>
                    
                    <Icon 
                        type="font-awesome"
                        name="id-badge"
                        iconStyle={styles.iconPersonalInfo}
                        size={30}
                    />
                </View>
                <Text>
                    {
                        user.displayName ? user.displayName : "Documento identidad"
                    }
                </Text>

            </View>
            <View style={styles.viewPersonalInfoContainer}>
                <View style={styles.viewPersonalInfo}>
                    
                    <Icon 
                        type="font-awesome"
                        name="envelope"
                        iconStyle={styles.iconPersonalInfo}
                        size={30}
                    />
                </View>
                <Text>
                    {
                        user.email ? user.email : "Anonimo"
                    }
                </Text>
            </View>
            <View style={styles.viewPersonalInfoContainer}>
                <View style={styles.viewPersonalInfo}>
                    
                    <Icon 
                        type="font-awesome"
                        name="phone"
                        iconStyle={styles.iconPersonalInfo}
                        size={30}
                    />
                </View>
                <Text>
                    {
                        user.phoneNumber ? user.phoneNumber : "Numero telefonico"
                    }
                </Text>
            </View>

        </View>
        
    )
}

function AppointmentsStats({user}){
    return(
        <View style={styles.viewPersonalStats} >
            <View style={[styles.viewStatAppointment,styles.divider]}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.stat}>Citas Pendientes</Text>
            </View>
            <View style={styles.viewStatAppointment}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.stat}>Citas Antiguas</Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    containerHeader:{
        marginHorizontal:32,
        paddingVertical: 30,
        
    },
    container:{
        alignItems: "center",
        backgroundColor: "#047ca4",
        paddingVertical: 30,
    },
    infoUser:{
        marginLeft:20,
        justifyContent: "center",
        alignItems: "center"
    },

    displayName:{
        fontWeight:"bold",
        fontSize: 20,
        marginTop: 5,
        color: "white"
    },
    rowBeetween:{
  
        flexDirection:"row",
        justifyContent: "flex-end"
    },
    imageContainer:{
        alignItems: "center",
        justifyContent: "center",
        marginTop:16,
        shadowColor: "#222",
        shadowOffset:{
            height: 3,
            width: 1
        },
        shadowOpacity:0.5
    },
    check:{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius:100,
        width: 40,
        height: 40,
        shadowColor: "#222",
        shadowOffset:{
            height: 3,
            width: 1
        },
        shadowOpacity:0.3,
        position:"absolute",
        zIndex:1,
        right:-16,
        bottom:16
    },
    iconPoints:{
        color: "#FFFFFF"
    },
    viewTitle:{
        alignItems: "center",
        justifyContent: "center",
        marginVertical:12
    },
    titleName:{
        color: "#FFFFFF",
        fontSize: 30
    },
    viewPersonalInfoContainer:{
        flexDirection:"row",
        alignItems: "center",
        marginTop:25,
        backgroundColor: "#e3e6e6",
        paddingHorizontal:16,
        paddingVertical: 8,
        width: "90%",
        alignSelf: "center",
        borderRadius:20

    },
    viewPersonalInfo:{
        width: 50,
        height: 50,
    },
    imageUserName:{
        flex:1,
        width: 20,
        resizeMode: "center"
    },
    iconPersonalInfo:{
        marginTop:10,
        color: "#c1c1c1"
    },
    viewPersonalStats:{
        paddingVertical: 15,
        paddingHorizontal: 32,
        marginBottom: 5,
        backgroundColor: "#877f7e",
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal:16,
        borderRadius:16,
        marginTop:-25
    },
    viewStatAppointment:{
        alignItems: "center",
        justifyContent: "center",
        flex:1,
    },
    statNumber:{
        fontSize: 20,
        fontWeight: "600",
        fontWeight:"bold",
        color: "#FFFFFF"
    },
    stat:{
        fontSize: 11,
        fontWeight: "600",
        letterSpacing:1,
        textTransform:"uppercase",
        color: "#FFFFFF",
        marginTop:6
    },
    divider:{
       borderRightWidth:1,
       borderColor: "#FFFFFF"
    },
    profilePhoto:{
        width: 120,
        height: 120,
        borderRadius:50
    }
    

})
