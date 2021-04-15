import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,Alert } from 'react-native'
import { Icon, Image, Input } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import uuid from 'random-uuid-v4'

import Toast from 'react-native-easy-toast'

import { formatDate, getCountryCode, loadImageFromGallery } from '../../utils/helpers'
import { deleteDocument, updateDocument, uploadImage } from '../../utils/actions'
import Loading from '../../components/Loading'
import { isEmpty, map } from 'lodash'

export default function MemberDetails({navigation, route}) {

    const toasRef = useRef()


    const {socialMember} = route.params

    const {
        callingCode,
        images,
        nameMember,
        numberIdentifyMember,
        phoneNumber,
        id
    } = socialMember.item

    const initialData ={
        callingCode,
        images,
        nameMember,
        numberIdentifyMember,
        phoneNumber,
        id
    }

    const [formData, setFormData] = useState(initialData)
    const [name, setName] = useState(null)
    const [phone, setPhone] = useState(null)
    const [numberIdentifyModified, setNumberIdentify] = useState(null)
    const [imageProfile, setImageProfile] = useState(images)

    const [errorName, setErrorName] = useState(null)
    const [errorNumberIdentify, setErrorNumberIdentify] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    
    const [loading, setLoading] = useState(false)

    const onChange =(e,type) =>{
        setFormData({...formData,[type] : e.nativeEvent.text})
    }

    const updateProfilePhoto = async() =>{

        const resultImageSelected = await loadImageFromGallery([1,1])

        if(!resultImageSelected.status){
            return
        }
        setImageProfile(resultImageSelected.image)

    }

    const askDeleteMember = async()=>{
        Alert.alert(
            "Eliminar Integrante",
            "¿Estas seguro de eliminar el integrante?",
            [
                {
                    text:"No",
                    style:"cancel"
                },
                {
                    text:"Si",
                    onPress:() =>{
                        deleteAppointment()
                    }
                }
            ]
            ,
            {
                cancelable:true
            }
        )
    }

    const modifyMember= async() =>{

    

        if(!validateForm()){
            return
        }
        

        setLoading(true)

        if(imageProfile.includes("file:/")){
            const response = await uploadImage(imageProfile, "socialGroupImages",uuid()) 
            if(response.statusResponse){
                formData.images= response.url
            }
        }

        const result = await updateDocument("SocialGroup",id,formData)

        if(!result.statusResponse){
            toasRef.current.show("Error al modificar el integrante. ",3000)
            setLoading(false)
            return
        }

        setLoading(false)

        navigation.navigate("social")



    }

    const uploadImages =async(newImages)=>{

        // const imagesUrl = []
        // await Promise.all( 
        //     map(newImages, async(image) =>{
        //         const response = await uploadImage(image, "appointmentsImages",uuid()) 
        //         if(response.statusResponse){
        //             imagesUrl.push(response.url) 
        //         }
        //     })

        // ) 
        // return imagesUrl
    }

    const deleteAppointment = async()=>{
        const result = await deleteDocument("SocialGroup",id)

        if(!result.statusResponse){
            toasRef.current.show("Error al elimininar la cita. ",3000)
            return
        }
        navigation.navigate("social")
    }

    const validateForm =() =>{
        let isValid = true
        setErrorNumberIdentify(null)
        setErrorName(null)
        setErrorPhone(null)
        

        if(isEmpty(formData.nameMember)){
            setErrorName("Debes ingresar nombres y apellidos.")
            isValid= false
        }

        if(isEmpty(formData.numberIdentifyMember)){
            setErrorNumberIdentify("Debes ingresar numero de identificación.")
            isValid= false
        }

        if(isEmpty(formData.phoneNumber)){
            setErrorPhone("Debes ingresar numero de telefono")
            isValid= false
        }
        
        return isValid
    }

    return (
        <ScrollView style={styles.viewContainer}>

            <Loading isVisible={loading}  text="Cargando..."/>
            <Toast ref={toasRef} position= "bottom" opacity={0.9}  />

            <View style={styles.viewBody}>
                {/* Input Name */}
                <Input 
                    placeholder="Nombre integrante..."
                    label="Nombre Completo"
                    defaultValue={formData.nameMember}
                    errorMessage= {errorName}
                    onChange={(e) => onChange(e,"nameMember")}
                    rightIcon={{
                        type:"font-awesome",
                        name :"user",
                        color: formData.nameMember ? "#22af1b" : "#c2c2c2"
                    }}
                />

                {/* Input numberIdentify */}
                <Input 
                    placeholder="Documento identidad..."
                    label="Nro.Identidad"
                    defaultValue={formData.numberIdentifyMember}
                    errorMessage= {errorNumberIdentify}
                    onChange={(e) => onChange(e,"numberIdentifyMember")}
                    rightIcon={{
                        type:"font-awesome",
                        name :"id-badge",
                        color: formData.numberIdentifyMember ? "#22af1b" : "#c2c2c2"
                    }}
                />

                <InputPhone 
                    formData={formData}
                    errorPhone={errorPhone}
                    callingCodeInitial={formData.callingCode}
                    phoneInitial={formData.phoneNumber}
                />

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
                                imageProfile
                                ? {uri: imageProfile}
                                : require("../../assets/avatar-default.jpg")
                            }
                            style={styles.profilePhoto}
                            onPress={updateProfilePhoto}
                        />
                    
                    </View>
                </View>
                
                <View style={styles.viewBodyButton}>
                    <TouchableOpacity 
                        style={styles.btnSave}
                        onPress={modifyMember}
                    >
                        <Text style={styles.textSave}>
                            Guardar Integrante
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.btnDelete}
                        onPress={askDeleteMember}
                    >
                        <Text style={styles.textSave}>
                            Eliminar
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    )
}


function InputPhone({formData,errorPhone,callingCodeInitial,phoneInitial}){

    const [callingCode, setCallingCode] = useState(callingCodeInitial)
    const [phone, setPhone] = useState(phoneInitial) 

    const [country, setCountry] = useState(getCountryCode(callingCode))

    const onChageInternal =(e)=>{
        setPhone(e.nativeEvent.text)
        formData.phoneNumber= e.nativeEvent.text
    }

    return(
        <View >
            <Text style={styles.textTitle}>
                 Añadir Telefono
            </Text>
            <View style={styles.viewPhone}>
                 <View style={styles.viewCountry}> 

                    <CountryPicker
                        withFlag
                        withCallingCode
                        withFilter
                        withCallingCodeButton
                        countryCode={country}
                        callingCode={callingCode}
                        containerStyle={styles.countryPickerStyle}
                        onSelect= {(country) =>{
                            setCountry(country.cca2)
                            setCallingCode(country.callingCode[0])
                            formData.callingCode= country.callingCode[0]
                        }}
                    />
                </View>
                    
                <Input 
                    placeholder="Numero celular..."
                    defaultValue={phone}
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    onChange={(e) => onChageInternal(e)}
                    errorMessage={errorPhone}
                    rightIcon={{
                        type:"font-awesome",
                        name :"phone",
                        color: phone ? "#22af1b" : "#c2c2c2"
                    }}
                />
            </View>

        </View>
    )
        
}

const styles = StyleSheet.create({
    viewContainer:{
        height: "100%",
        flex:1,
        marginTop:20
    },
    viewBody:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%",
        marginBottom:1,
        marginTop: 10
    },
    icon:{
        marginRight:10
    },
    viewInput:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%",
        marginTop:15
    },
    textTitle:{
        marginLeft:10,
        fontSize: 16,
        color:"#8D99A3",
        fontWeight:"bold"
    },
    viewPhone:{
        flexDirection:"row",
        marginLeft:10,
    },
    countryPickerStyle:{
        alignItems:"center",
        marginTop: 10
    },
    viewCountry:{
        marginVertical:14
    },
    inputPhone:{
        marginBottom: 10, 
        width:"80%"
    },
    profilePhoto:{
        width: 130,
        height: 130,
        borderRadius:50
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
    btnSave:{
        width:"90%",
        height: 40,
        justifyContent: "center",
        alignItems:"center",
        alignSelf:"center",
        borderRadius: 10,
        backgroundColor: "#047ca4",
        marginBottom:10
    },
    btnDelete:{
        width:"90%",
        height: 40,
        justifyContent: "center",
        alignItems:"center",
        alignSelf:"center",
        borderRadius: 10,
        backgroundColor: "#f4544c",
        marginBottom:10
    },
    textSave:{
        color: "#FFFFFF",
        fontWeight: "bold"
    },
    viewBodyButton:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%",
        marginTop:20
    },
})
