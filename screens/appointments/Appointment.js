import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TouchableOpacity,LogBox,ScrollView,StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Icon, Input } from 'react-native-elements'
import moment from 'moment'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import MultiSelect from 'react-native-multiple-select';
import { useFocusEffect } from '@react-navigation/native'
import { filter, isDate, isEmpty, map, size } from 'lodash'
import Toast from 'react-native-easy-toast'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'

import Loading from '../../components/Loading'
import { getAllSocialGroup, getAllTags, getCurrentUser, uploadImage,deleteDocument, updateDocument } from '../../utils/actions'
import { getCurrentLocation, loadImageFromGalleryWithoutEditing } from '../../utils/helpers'
import { Alert } from 'react-native'
import Modal from '../../components/Modal'

LogBox.ignoreAllLogs();


export default function Appointment({navigation,route}) {

    const toasRef = useRef()

    const {appointment} = route.params
    const {
        address,
        createAt,
        dateAndTime,
        doctor,
        id,
        idCreator,
        idPatient,
        idTags,
        images,
        location,
        name,
        namePatient,
        notes
    } = appointment.item

    const initialData ={
        address,
        createAt,
        dateAndTime,
        doctor,
        id,
        idCreator,
        idPatient,
        idTags,
        images,
        location,
        name,
        namePatient,
        notes
    }

    const [formData, setFormData] = useState(initialData)
    const [dateSelected, setDateSelected] = useState(moment(dateAndTime.toDate()).format('YYYY-MM-DD hh:mm A'))

    const [errorName, setErrorName] = useState(null)
    const [errorDateAndTime, setErrorDateAndTime] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)

    const [memberPatients, setmemberPatients] = useState([])
    const [userTags, setUserTags] = useState([])
    const [userData, setUserData] = useState(getCurrentUser())
    const [selectedPatient, setSelectedPatient] = useState([])
    const [idTagsSelected, setIdTagsSelected] = useState([])
    const [imagesSelected, setImagesSelected] = useState(images)
    const [locationAppointment, setLocationAppointment] = useState(null)

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [visibleMap, setVisibleMap] = useState(false)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getAllSocialGroup(userData.uid)

                const dataCurrentUser={
                    id: userData.uid,
                    name : "Yo ("+userData.displayName+")"
                }

                if (response.statusResponse) {
                    const dataResult = response.socialGroup.map(doc => ({id:doc.idMemberUser, name: doc.nameMember}))
                    /*I sort the array of objects by member name */
                    dataResult.sort((a,b) => a.name.localeCompare(b.name))
                    setmemberPatients([dataCurrentUser,...dataResult])
                }


                const responseTags = await getAllTags(userData.uid)
                if(responseTags.statusResponse){
                    const dataResultTags = responseTags.tags.map(doc => ({id:doc.id, name: doc.tagName}))
                    dataResultTags.sort((a,b) => a.name.localeCompare(b.name))
                    setUserTags(dataResultTags)
                }
                
                setLoading(false)
            }
            getData()
        }, [])
    )

    const onChange =(e,type) =>{
        setFormData({...formData,[type] : e.nativeEvent.text})
    }


    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = (datetime) => {
        setDatePickerVisibility(false);

    };
    
    const handleConfirm = (datetime) => {
        hideDatePicker();
        setDateSelected(moment(datetime).format('YYYY-MM-DD hh:mm A'))
        setFormData({...formData,"dateAndTime" : datetime})
    };

    const onChangeSingleSelected =(selectedPatient)=>
    {
        setSelectedPatient(selectedPatient)
        setFormData({...formData, idPatient : selectedPatient[0]})
    }

    const onChangeSingleMultiple =(idTags)=>{

        if(size(idTags)>3){
            toasRef.current.show("Solo puedes elegir 3 etiquetas por cita",3000)
            return
        }

        const objectItems = {...idTags}
        setIdTagsSelected(idTags)
        setFormData({...formData, idTags : objectItems})
    }

    const imageSelect = async() =>{
        const response = await loadImageFromGalleryWithoutEditing() 
        if(!response.status){
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage =(image) =>{
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro de eliminar?",
            [
                {
                    text:"No",
                    style:"cancel"
                },
                {
                    text:"Si",
                    onPress:() =>{
                        setImagesSelected(
                            filter(imagesSelected,(imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ]
            ,
            {
                cancelable:true
            }
        )
    }

    const modifiyAppointment = async()=>{


        const imagesFirebase = imagesSelected.filter(name => name.includes("https://firebasestorage"))
        const imagesLocal = imagesSelected.filter(name => name.includes("file:/"))

        let resultUploadImage =[]

        if(size(imagesLocal)>0){
            resultUploadImage = await uploadImages(imagesLocal)
        }
        const finalImages = [...imagesFirebase,...resultUploadImage]

        formData.images = finalImages
        formData.location = locationAppointment && locationAppointment 
        formData.namePatient = getNamePatientById(formData.idPatient)

        if(!validateForm()){
            return
        }
        setLoading(true)
        const result = await updateDocument("Appointments",id,formData)

        if(!result.statusResponse){
            toasRef.current.show("Error al modificar la cita. ",3000)
            setLoading(true)
            return
        }
        setLoading(false)
        navigation.navigate("appointments")

    }

    const validateForm =()=>{
        let isValidForm=true

        if(isEmpty(formData.name)){
            setErrorName("Ingresa por favor un nombre para la cita.")
            isValidForm=false
        }

        if(isEmpty(formData.dateAndTime)  && !isDate(formData.dateAndTime)){
            setErrorDateAndTime("Ingresa por favor una fecha para la cita.")
            isValidForm= false
        }

        if(isEmpty(formData.address)){
            setErrorAddress("Ingresa una direccion ó clinica.")
            isValidForm= false
        }
        return isValidForm
    }

    const getNamePatientById =(idPatient)=>{
        const name = memberPatients.filter(patient => patient.id ===idPatient)
        const namePatient = name.map(patient => patient.name)[0]
        return namePatient
    }


    const askDeleteAppointment = async()=>{
        Alert.alert(
            "Eliminar Cita",
            "¿Estas seguro de eliminar la cita?",
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

    const deleteAppointment = async()=>{
        const result = await deleteDocument("Appointments",id)

        if(!result.statusResponse){
            toasRef.current.show("Error al elimininar la cita. ",3000)
            return
        }
        navigation.navigate("appointments")
    }


    const uploadImages =async(newImages)=>{

        const imagesUrl = []
        await Promise.all( 
            map(newImages, async(image) =>{
                const response = await uploadImage(image, "appointmentsImages",uuid()) 
                if(response.statusResponse){
                    imagesUrl.push(response.url) 
                }
            })

        ) 
        return imagesUrl
    }



    return (
        <ScrollView style={styles.viewContainer}>

            <Loading isVisible={loading}  text="Cargando..."/>
            <Toast ref={toasRef} position= "bottom" opacity={0.9}  />

            
            <View style={[styles.viewBody,{
                    marginTop:15
            }]}>
                {/* Input Name */}
                <Input 
                    placeholder={"Nombre o descripcion de la cita...."}  
                    label="Nombre Cita" 
                    defaultValue={formData.name}
                    errorMessage= {errorName}
                    onChange={(e) => onChange(e,"name")}
                    rightIcon={{
                        type:"font-awesome",
                        name :"commenting-o",
                        color: formData.name ? "#22af1b" : "#c2c2c2"
                    }}
                />

                {/* Input Calendar */}
                <TouchableOpacity onPress={showDatePicker} >
                    <Input 
                        placeholder="Fecha de la cita"
                        defaultValue= {dateSelected}
                        label="Fecha/Hora"
                        editable={false}
                        errorMessage={errorDateAndTime}
                        rightIcon={
                            <TouchableOpacity
                                onPress={showDatePicker}
                            >
                                <Icon 
                                    type="font-awesome"
                                    name="calendar"
                                    color = {formData.dateAndTime ? "#22af1b" : "#c2c2c2"}
                                />
                            </TouchableOpacity>
                        }
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode={"datetime"}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        is24Hour={false}
                        minimumDate={new Date()}
                        defaultValue={new Date()}
                    />
                </TouchableOpacity>

                {/* Input Address */}
                <Input 
                    placeholder="Dirección de la cita"
                    onChange={(e) => onChange(e, "address")}
                    errorMessage={errorAddress}
                    label="Dirección ó Clinica"
                    defaultValue={formData.address}
                    rightIcon ={{
                        type:"font-awesome",
                        name: initialData.location ? "check-square-o"  : "map-marker",
                        color: initialData.location ? "#22af1b": "#c2c2c2",
                        onPress:() => setVisibleMap(true)
                    }}
                />
                {/* Input Patient */}
                <MultiSelect 
                    hideTags={false}
                    items={memberPatients}
                    uniqueKey="id"
                    displayKey="name"
                    onSelectedItemsChange={onChangeSingleSelected}
                    selectedItems={selectedPatient}
                    selectText={formData.namePatient}
                    searchInputPlaceholderText="Buscar Paciente..."
                    tagRemoveIconColor="#f4544c"
                    tagBorderColor="#067da4"
                    tagTextColor="#877f7e"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    searchInputStyle={styles.searchInputMultiSelect}
                    submitButtonColor="#047ca4"
                    submitButtonText="Seleccionar"
                    single={true}
                    selectedItemIconColor="#047ca4"
                    selectedItemTextColor= "#047ca4"
                    styleTextDropdown={styles.textDropdownMultiSelect}
                    styleTextDropdownSelected={styles.textDropdownSelectedMultiSelect}
                    styleDropdownMenuSubsection={styles.dropdownMenuSubsectionMultiSelect}
                />

                {/* Input Doctor */}
                <Input 
                    placeholder="Nombre del medico."
                    label="Medico" 
                    defaultValue={formData.doctor}
                    onChange={(e) => onChange(e,"doctor")}
                    rightIcon={{
                        type:"font-awesome",
                        name :"user-md",
                        color: formData.doctor ? "#22af1b" : "#c2c2c2"
                    }}
                    containerStyle={{marginTop:10}}
                />

                 {/* Input Tags */}
                 <MultiSelect 
                    hideTags={false}
                    items={userTags}
                    uniqueKey="id"
                    displayKey="name"
                    onSelectedItemsChange={onChangeSingleMultiple}
                    selectedItems={idTagsSelected}
                    selectText="Etiquetas..."
                    searchInputPlaceholderText="Buscar Etiqueta..."
                    tagRemoveIconColor="#f4544c"
                    tagBorderColor="#067da4"
                    tagTextColor="#877f7e"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    searchInputStyle={styles.searchInputMultiSelect}
                    submitButtonColor="#047ca4"
                    submitButtonText="Seleccionar"
                    single={false}
                    selectedItemIconColor="#047ca4"
                    selectedItemTextColor= "#047ca4"
                    styleTextDropdown={styles.textDropdownMultiSelect}
                    styleTextDropdownSelected={styles.textDropdownSelectedMultiSelect}
                    styleDropdownMenuSubsection={styles.dropdownMenuSubsectionMultiSelect}
                />

                <Input 
                    placeholder="Notas..."
                    multiline
                    containerStyle={styles.textArea}
                    defaultValue={formData.notes}
                    onChange={(e) => onChange(e, "notes")}
                    label="Notas"
                    rightIcon={
                        <Icon 
                            type="font-awesome"
                            name="comments-o"
                            color = {formData.notes ? "#22af1b" : "#c2c2c2"}
                        />
                    }
                />
                
                <View style={styles.viewBody}>
                    <Text style={styles.textImage}>Imagenes</Text>
                    <ScrollView
                        horizontal
                        style={styles.viewImage}
                    >
                        {
                            size(imagesSelected) <10 && (
                                <TouchableOpacity
                                    onPress={imageSelect}
                                >
                                    <Icon
                                    type="font-awesome"
                                    name= {size(imagesSelected) > 0 ? "plus" :"picture-o"}
                                    color= {size(imagesSelected) > 0 ? "#22af1b": "#7a7a7a"}
                                    containerStyle={styles.containerIcon}
                                    onPress={imageSelect}

                                />
                                </TouchableOpacity>
                                
                            )
                        }
                        {

                            map(imagesSelected ,(imageRestaurant, index) => (
                                <Avatar 
                                    key={index}
                                    style={styles.miniatureStyle}
                                    source={{ uri: imageRestaurant}}  
                                    onPress={() => removeImage(imageRestaurant)}  
                                />
                            ))
                        }
                    </ScrollView>
                </View>
                
                <MapAppointment 
                    visibleMap={visibleMap}
                    setVisibleMap={setVisibleMap}
                    setLocationAppointment={setLocationAppointment}
                    toasRef={toasRef}
                    initialLocation={initialData.location}
                />
                <View style={[styles.viewBody,{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop:10
                    }]}>
                    <TouchableOpacity 
                    style={styles.btnSave}
                    onPress={modifiyAppointment}
                    >
                        <Text style={styles.textSave}>
                            Guardar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={styles.btnDelete}
                    onPress={askDeleteAppointment}
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


function MapAppointment({visibleMap,setVisibleMap,setLocationAppointment,toasRef,initialLocation}){
    const [newRegionAppointment, setNewRegionAppointment] = useState(null)

    useEffect(() => {
        isEmpty(initialLocation) 
        ?
            (async()=>{
                const response = await getCurrentLocation()
                if(response.status){
                    setNewRegionAppointment(response.location)
                
                }
            })()
            
        
        :
            setNewRegionAppointment(initialLocation)
        
    }, [])


    const confirmLocation =() =>{
        setLocationAppointment(newRegionAppointment)
        toasRef.current.show("Ubicacion de la clinica guardada correctamente.",3000)

        setVisibleMap(false)
    }

    return(
        <Modal isVisible={visibleMap} setVisible={setVisibleMap}>
            <View>
                {
                    newRegionAppointment &&
                    (
                        <MapView 
                            style={styles.mapStyle}
                            initialRegion={newRegionAppointment}
                            showsUserLocation={true}
                            onRegionChange={(region) =>setNewRegionAppointment(region)}
                        >
                            <MapView.Marker 
                                coordinate={{
                                    latitude: newRegionAppointment.latitude,
                                    longitude: newRegionAppointment.longitude
                                }}
                                draggable 
                            />
                        </MapView>
                    )
                }
                <View style={styles.viewMapBtn}>
                    <Button 
                        title="Guardar Ubicación "
                        containerStyle ={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={() =>confirmLocation()}
                    />
                    <Button 
                    
                        title="Cancelar"
                        containerStyle ={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

const defaultFormValues =() =>{
    return {
        name:"",
        dateAndTime: "",
        address:"",
        idPatient:"",
        notes:"",
        doctor:"",
        idTags: ""
    }
}

const styles = StyleSheet.create({
    viewContainer:{
        flex:1,
        height: "100%",
        marginBottom:15
    },
    containerIcon:{
        alignItems:"center",
        justifyContent: "center",
        marginRight: 10,
        height: 80,
        width: 80,
        backgroundColor:"#e3e3e3",
        borderRadius: 10

    },
    viewImage:{
        flexDirection :"row",
        marginHorizontal:10,
        paddingBottom: 10
    },
    viewBody:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%"

    },
    searchInputMultiSelect:{
        color: 'black',
        height: 50 
    },
    textDropdownMultiSelect:{
        marginLeft:10,
        fontSize: 18,
        color:"#8D99A3"
    },
    textDropdownSelectedMultiSelect:{
        marginLeft:10,
        fontSize: 18,
    },

    dropdownMenuSubsectionMultiSelect:{
        borderRadius: 10,
        borderColor: "black",
        height: 60,
        backgroundColor: "transparent"

    },
    textImage:{
        marginLeft:10,
        fontSize: 18,
        color:"#8D99A3",
        marginTop:20
    },
    miniatureStyle:{
        width: 80,
        height: 80,
        marginRight: 10
    },
    btnSave:{
        width:"40%",
        height: 40,
        justifyContent: "center",
        alignItems:"center",
        alignSelf:"center",
        borderRadius: 10,
        backgroundColor: "#047ca4",
        marginBottom:10
    },
    btnDelete:{
        width:"40%",
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
    
    viewMapBtn:{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10
    },
    viewMapBtnContainerSave:{
        paddingRight: 5
    },
    viewMapBtnContainerCancel:{
        paddingLeft: 5
    },
    viewMapBtnCancel:{
        backgroundColor: "#f4544c"
    },
    viewMapBtnSave:{
        backgroundColor: "#047ca4"
    },
    mapStyle:{
        width: "100%",
        height: 550
    },
    textArea:{
        height: 100,
        width: "100%",
        marginTop:15
    },

})
