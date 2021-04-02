import React,{useState,useEffect,useRef} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, View,ScrollView,Alert,StyleSheet } from 'react-native'
import { Icon,Image } from 'react-native-elements'
import { map } from 'lodash'
import { TouchableOpacity } from 'react-native'
import OptionesMenu from "react-native-option-menu"
import Toast from 'react-native-easy-toast' 

import { getCurrentUser,uploadImage,updateProfile, closeSession } from '../../utils/actions'
import { loadImageFromGallery } from '../../utils/helpers'
import Loading from '../../components/Loading'
import Modal from '../../components/Modal'
import DisplayDataForm from '../../components/profile/DisplayDataForm'



export default function UserLogged({setLogged}) {
    const [user, setUser] = useState(getCurrentUser())
    const [reloadUser, setReloadUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const toasRef = useRef()

    useEffect(() => {
        setUser(getCurrentUser())
        setReloadUser(false)
    }, [reloadUser])


    return (
        <ScrollView>
            {
                user &&(
                    <View>
                        
                        <Header user={user} 
                            setLoading={setLoading} 
                            setLoadingText={setLoadingText} 
                            setReloadUser={setReloadUser} 
                            setLogged={setLogged}
                            
                        />
                        <AppointmentsStats user={user}/>
                        <PersonalInfo user={user} setReloadUser={setReloadUser} toasRef={toasRef}/>
                        <Loading isVisible={loading} text={loadingText} />
                        <Toast ref={toasRef} position="bottom" opacity={0.7}/>
                    </View>

                )
            }
            
        </ScrollView>
    )
}

function Header({user,setLoading, setLoadingText,setLogged}){
    const CloseSessionUser =() =>{
        closeSession()
        setLogged(false)
    }

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
                        <OptionesMenu 
                            customButton ={
                                <Icon 
                                    type="font-awesome"
                                    name="bars"
                                    iconStyle={styles.iconPoints}     
                                                          
                                />
                            }
                            options={["Cerrar Sesión", "Cancelar"]}
                            actions={[CloseSessionUser]}                        
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

function PersonalInfo({user,setReloadUser,toasRef}){
    const [showModalInfo, setShowModalInfo] = useState(false)
    const [renderComponentInfo, setRenderComponentInfo] = useState(null)


    const dataOptionsUser =()=>{
        return[
            {
                iconName:"user-circle",
                textData: user.displayName ? user.displayName : "Nombre Completo",
                onPress: () => selectedField("displayName")
            },
            {
                iconName:"id-badge",
                textData: "Documento identidad",
                onPress: () => selectedField("numberIdentify")
            },
            {
                iconName:"envelope",
                textData: user.email ? user.email : "Correo electronico",
                onPress: () => selectedField("email")
            },
            {
                iconName:"phone",
                textData: user.phoneNumber ? user.phoneNumber : "Numero telefonico",
                onPress: () => selectedField("phoneNumber")
            },
            {
                iconName:"lock",
                textData:  "Contraseña",
                onPress: () => selectedField("password")
            },
            
        ]

    }

    const selectedField =(key) =>{
        switch (key) {
            case "displayName":
                setRenderComponentInfo(
                    <DisplayDataForm 
                        typeField={key} 
                        valueField={user.displayName} 
                        setReloadUser={setReloadUser} 
                        setShowModalInfo={setShowModalInfo}
                    />
                )
                break;
            case "numberIdentify":
                setRenderComponentInfo(
                    <DisplayDataForm 
                        typeField={key} 
                        valueField={user.uid} 
                        setReloadUser={setReloadUser} 
                        setShowModalInfo={setShowModalInfo} 
                        toasRef={toasRef}
                    />
                )
                break;
            case "email":
                setRenderComponentInfo(
                    <DisplayDataForm 
                        typeField={key} 
                        valueField={user.email} 
                        setReloadUser={setReloadUser} 
                        setShowModalInfo={setShowModalInfo} 
                        toasRef={toasRef}
                    />
                )
                break;
            case "phoneNumber":
                setRenderComponentInfo(
                    <DisplayDataForm 
                        typeField={key} 
                        valueField={user.phoneNumber} 
                        setReloadUser={setReloadUser} 
                        setShowModalInfo={setShowModalInfo} 
                        toasRef={toasRef}
                    />
                )
                break;
            case "password":
                setRenderComponentInfo(
                    <DisplayDataForm 
                        typeField={key} 
                        valueField={""} 
                        setReloadUser={setReloadUser} 
                        setShowModalInfo={setShowModalInfo} 
                        toasRef={toasRef}
                    />
                )
                break;
           
        }
        setShowModalInfo(true)
    }

    const menuData = dataOptionsUser()

    return(
        <View>
            {
                map(menuData,(menu,index)=>(
                    <TouchableOpacity
                        key={index}
                        onPress={menu.onPress}
                    >
                        <View style={styles.viewPersonalInfoContainer}>
                            <View style={styles.viewPersonalInfo}>
                            
                                <Icon
                                    type="font-awesome"
                                    name={menu.iconName}
                                    iconStyle={styles.iconPersonalInfo}
                                    size={30}
                                />
                            </View>
                            <Text>
                                {menu.textData}
                            </Text>
                        </View>

                    </TouchableOpacity>
                ))
            }
            <Modal isVisible ={showModalInfo} setVisible ={setShowModalInfo}>   
                 {
                     renderComponentInfo
                 }

            </Modal>

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
        marginTop:15,
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
        width: 130,
        height: 130,
        borderRadius:50
    }
    

})
