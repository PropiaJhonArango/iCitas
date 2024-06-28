import React,{useState,useEffect, useCallback} from 'react'
import { Text, View,ScrollView,Alert,StyleSheet,TouchableOpacity } from 'react-native'
import { Icon,Image } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { map } from 'lodash'
import OptionesMenu from "react-native-option-menu"


import { getCurrentUser,uploadImage,updateProfile, closeSession, updateDocument, getCollectionWithId } from '../../utils/actions'
import { loadImageFromGallery } from '../../utils/helpers'
import Loading from '../../components/Loading'
import Modal from '../../components/Modal'
import DisplayDataForm from '../../components/profile/DisplayDataForm'



export default function UserLogged({setLogged}) {
    const [user, setUser] = useState()
    const [reloadUser, setReloadUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")

    useEffect(() => {
        setUser(getCurrentUser())
        setReloadUser(false)
        
    }, [reloadUser])

    return (
        <ScrollView>
            {
                user &&(
                    <ScrollView>
                        
                        <Header 
                            user={user} 
                            setLoading={setLoading} 
                            setLoadingText={setLoadingText} 
                            setLogged={setLogged}
                            
                        />
                        <AppointmentsStats 
                            user={user}
                        />

                        <PersonalInfo 
                            user={user} 
                            setUser={setUser}
                            setReloadUser={setReloadUser} 
                        />

                        <Loading isVisible={loading} text={loadingText} />
                        
                    </ScrollView>

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

        await updateDocument("Users",user.uid,{photoURL: resultUploadImage.url})

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

function PersonalInfo({user,setUser,setReloadUser,toasRef}){

    const [showModalInfo, setShowModalInfo] = useState(false)
    const [renderComponentInfo, setRenderComponentInfo] = useState(null)
    const [infoUser, setInfoUser] = useState("")
    const [loading, setLoading] = useState(false)
    const [reloadInfoExternal, setReloadInfoExternal] = useState(false)
    

      useFocusEffect(

        useCallback(() => {

            (async ()=> {
                setLoading(true)
                const result = await getCollectionWithId("Users",user.uid)
                setUser({
                    ...user,
                    numberIdentify: result.data.numberIdentify ,
                    phoneNumberUser: result.data.phoneNumber ,
                    callingCode: result.data.callingCode 
                })
                setInfoUser({
                    numberIdentify: result.data.numberIdentify ,
                    phoneNumberUser: result.data.phoneNumber ,
                    callingCode: result.data.callingCode 

                })
                setReloadInfoExternal(false)
                setLoading(false)
            })()
        }, [reloadInfoExternal])

    )



    const dataOptionsUser =()=>{
        return[
            {
                iconName:"user-circle",
                textData: user.displayName ? user.displayName : "Nombre Completo",
                onPress: () => selectedField("displayName")
            },
            {
                iconName:"id-badge",

                /*If the user has not defined a name, "Identification number" is displayed by default*/
                 textData:  user.numberIdentify 
                            ? user.numberIdentify 
                            :  (infoUser.numberIdentify ? infoUser.numberIdentify : "Numero de identificación"),
                
                onPress: () => selectedField("numberIdentify")
            },
            {
                iconName:"envelope",
                textData: user.email ? user.email : "Correo electronico",
                onPress: () => selectedField("email")
            },
            {
                iconName:"phone",
                textData_Calling:   user.callingCode ? user.callingCode : infoUser.callingCode,
                textData_Phone: user.phoneNumberUser ? user.phoneNumberUser : infoUser.phoneNumberUser,
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
                        toasRef={toasRef}
                        uidUser={user.uid}
                        setReloadInfoExternal={setReloadInfoExternal}
                    />
                ) 
                break;
            case "numberIdentify":
                setRenderComponentInfo(
                    <DisplayDataForm 
                        typeField={key} 
                        valueField={user.numberIdentify} 
                        setReloadUser={setReloadUser} 
                        setShowModalInfo={setShowModalInfo} 
                        toasRef={toasRef}
                        uidUser={user.uid}
                        setReloadInfoExternal={setReloadInfoExternal}
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
                        uidUser={user.uid}
                        setReloadInfoExternal={setReloadInfoExternal}
                    />
                )
                break;
            case "phoneNumber":
                setRenderComponentInfo(
                    <DisplayDataForm 
                        typeField={key} 

                        /*Because the phone is divided into two parts (Country code and phone number) 
                        I send it concatenated by a script and then make the split*/

                        valueField={ user.callingCode && user.callingCode+"_"+user.phoneNumberUser  } 
                        setReloadUser={setReloadUser} 
                        setShowModalInfo={setShowModalInfo} 
                        toasRef={toasRef}
                        uidUser={user.uid}
                        setReloadInfoExternal={setReloadInfoExternal}
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
                        uidUser={user.uid}
                        setReloadInfoExternal={setReloadInfoExternal}
                    />
                )
                break;
           
        }
        setShowModalInfo(true)
    }

    const menuData = dataOptionsUser()

    return(
        <ScrollView>
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
                            {
                                
                            }
                            <Text>
                                {
                                  
                                  menu.iconName ==="phone" 
                                  ?  (menu.textData_Calling ? "+"+menu.textData_Calling+" "+menu.textData_Phone: "Numero Telefonico") 
                                  : menu.textData
                                }
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
        <Loading isVisible={loading} text="Cargando..." />
        </ScrollView>
        
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
        paddingVertical: 20,
        
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
        marginTop:20,
        backgroundColor: "#e3e6e6",
        paddingHorizontal:16,
        
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
        paddingVertical: 10,
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
