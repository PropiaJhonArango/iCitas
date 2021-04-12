import React, { useState } from 'react'
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,LogBox,Alert } from 'react-native'
import { Icon, Image, Input } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'

import { getCountryCode, loadImageFromGallery } from '../../utils/helpers'

export default function AddSocialForm(setLoading, toasRef, navigation) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [name, setName] = useState(null)
    const [phone, setPhone] = useState(null)
    const [numberIdentify, setNumberIdentify] = useState(null)
    const [imageProfile, setImageProfile] = useState([])

    const [errorName, setErrorName] = useState(null)
    const [errorNumberIdentify, setErrorNumberIdentify] = useState(null)

    const onChange =(e,type) =>{
        setFormData({...formData,[type] : e.nativeEvent.text})
    }

    return (
        <ScrollView style={styles.viewContainer}>

            {/* Input name */}
            <FormAddInput
                placeholderInput="Nombre integrante..."
                labelInput="Nombre Completo"
                onChange={onChange}
                keyItemFormData="name"
                keyError={errorName}
                iconName="user"
                isMultiline={false}
                valueField={formData.name}
            />

             {/* Input name */}
             <FormAddInput
                placeholderInput="Documento identidad..."
                labelInput="Nro.Identidad"
                onChange={onChange}
                keyItemFormData="numberIdentify"
                keyError={errorNumberIdentify}
                iconName="id-badge"
                isMultiline={false}
                valueField={formData.numberIdentify}
            />

            <InputPhone 
                onChange={onChange}
            />
            <InputImage 
                setImageProfile={setImageProfile}
                imageProfile={imageProfile}
            />

            <View style={styles.viewBodyButton}>
                 <TouchableOpacity 
                    style={styles.btnSave}
                    // onPress={addAppointment}
                >
                    <Text style={styles.textSave}>
                        Guardar Integrante
                    </Text>
                </TouchableOpacity>
            </View>


        

          
            
        </ScrollView>
    )
}

const defaultFormValues =() =>{
    return {
        name:"",
        numberIdentify: "",
        phone:""
    }
}


function FormAddInput (
    {
        placeholderInput,
        labelInput,
        onChange,
        keyItemFormData,
        keyError,
        iconName,
        isMultiline,
        valueField
    }
    ){
    return(
        <View style={ keyItemFormData === "doctor" ? styles.viewInput  : styles.viewBody}>
            <Input 
                    placeholder={placeholderInput}  
                    label={labelInput}  
                    onChange ={(e) =>   onChange(e, keyItemFormData) }
                    errorMessage= {keyError}
                    multiline={isMultiline}
                    rightIcon={{
                        type:"font-awesome",
                        name :iconName,
                        color: valueField ? "#22af1b" : "#c2c2c2"
                    }}
                />
        </View>
    )
}


function InputPhone({onChange}){

    const [callingCode, setCallingCode] = useState("57")
    const [phone, setPhone] = useState(null) 

    const [country, setCountry] = useState(getCountryCode(callingCode))

    const [errorPhone, setErrorPhone] = useState(null)
    const [loading, setLoading] = useState(false)


    // const onSubmit = async() =>{
    //     if(!validateForm()){
    //         return
    //     }

    //     const userData ={
    //         callingCode : callingCode,
    //         phoneNumber: phone
    //     }
        
    //     setLoading(true)
    //     const resultCollection = await updateDocument("Users",uidUser,userData)
    //     if(!resultCollection.statusResponse){
    //         setErrorPhone("Error al actualizar el numero.")
    //         setLoading(false)
    //         return
    //     }
    //     setLoading(false)

    //     setReloadInfoExternal(true)
    //     setShowModalInfo(false)
        
    // }

    const validateForm = () =>{
        setErrorPhone(null)
        let isValid = true

        if(size(phone)<10){
            setErrorPhone("Debes ingresar un numero valido")
            isValid = false
        }

        return isValid
    }

    return(
        <View style={ styles.viewBody}>
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
                        }}
                    />
                </View>
                    
                <Input 
                    placeholder="Numero celular..."
                    defaultValue={phone}
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    onChange={(e) => setPhone(e.nativeEvent.text)}
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

function InputImage ({setImageProfile,imageProfile}){

    const [photoUrl, setPhotoUrl] = useState() 


    const updateProfilePhoto = async() =>{

        const resultImageSelected = await loadImageFromGallery([1,1])

        if(!resultImageSelected.status){
            return
        }
        setPhotoUrl(resultImageSelected.image)
        setImageProfile(resultImageSelected.image)
 
        // const resultUploadImage = await uploadImage(resultImageSelected.image,"avatars",user.uid)


        // if(!resultUploadImage.statusResponse){
        //     setLoading(false)
        //     Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
        //     return
        // }

        // const resultUpdateProfile = await updateProfile({photoURL: resultUploadImage.url})

        // await updateDocument("Users",user.uid,{photoURL: resultUploadImage.url})

        // setLoading(false)
        // if(resultUpdateProfile.statusResponse){
        //     setPhotoUrl(resultUploadImage.url)
            
        // }else{
        //     Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        // }
        
    }


    return(
        <View style={ styles.viewBody}>
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

                            // require("../../assets/avatar-default.jpg")
                            photoUrl
                            ? {uri: photoUrl}
                            : require("../../assets/avatar-default.jpg")
                        }
                        style={styles.profilePhoto}
                        onPress={updateProfilePhoto}
                    />
                
                </View>
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
        maxHeight: "100%"
    },
    icon:{
        // color: "#c1c1c1",
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
