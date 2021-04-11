import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,LogBox,Alert } from 'react-native'
import { Avatar, Button, Icon, Input } from 'react-native-elements'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import moment from 'moment'
import MultiSelect from 'react-native-multiple-select';
import { filter, isEmpty, map, size } from 'lodash'
import uuid from 'random-uuid-v4'
import MapView from 'react-native-maps'



import { addDocumentWithoutId, getCurrentUser, uploadImage} from '../../utils/actions'
import { getCurrentLocation, loadImageFromGalleryWithoutEditing } from '../../utils/helpers'
import Modal from '../Modal'

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);


export default function AddAppointmentForm({setLoading, toasRef,navigation}) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDateAndTime, setErrorDateAndTime] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorDoctor, setErrorDoctor] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [idTags, setIdTags] = useState([])
    const [selectedPatient, setSelectedPatient] = useState([])
    const [userData, setUserData] = useState(getCurrentUser())
    const [visibleMap, setVisibleMap] = useState(false)
    const [locationAppointment, setLocationAppointment] = useState(null)

    const onChange =(e,type) =>{
        setFormData({...formData,[type] : e.nativeEvent.text})
    }

    const itemsPatients = [
        {
        id: '92iijs7yta',
        name: "Yo ("+userData.displayName+")"
    }, 
      {
        id: 'a0s0a8ssbsd',
        name: 'Madre'
      }, 
      {
        id: '16hbajsabsd',
        name: 'Padre'
      }
    ]

    const itemsTags = [
        {
        id: "4444",
        name: "Cardiologo Padre"
    }, 
      {
        id: "555",
        name: "Reumatologo"
      }, 
      {
        id: "666",
        name: "Examen"
      }
      , 
      {
        id: "777",
        name: "Control"
      }
    ]
    
    const addAppointment = async()=>{

        
        if(!validateForm()){
            return
        }

        setLoading(true)
        
        let resultUploadImage =[]
        if(size(imagesSelected)>0){
             resultUploadImage = await uploadImages()
        }

        const appointmentInfo ={
            name: formData.name,
            dateAndTime: formData.dateAndTime,
            address: formData.address,
            location: locationAppointment,
            idPatient: formData.idPatient,
            namePatient: getNamePatientById(formData.idPatient),
            doctor: formData.doctor,
            idTags: formData.idTags,
            notes: formData.notes,
            createAt: new Date(),
            images: resultUploadImage,
            idCreator: getCurrentUser().uid
        }

        const responseAddAppointment = await addDocumentWithoutId("Appointments",appointmentInfo)
        setLoading(false)

        if(!responseAddAppointment.statusResponse){
            toasRef.current.show("Error al guardar la cita, intente nuevamente.",3000)
            return
        }
        navigation.navigate("appointments")

        
    }

    const uploadImages =async()=>{
        const imagesUrl = []
        await Promise.all( 
            map(imagesSelected, async(image) =>{
                const response = await uploadImage(image, "appointmentsImages",uuid()) //Para invocar un id unico que no se repita
                if(response.statusResponse){
                    imagesUrl.push(response.url) // Para subir la url a el array
                }
            })

        ) 
        return imagesUrl
    }

    const getNamePatientById =(idPatient)=>{
        const name = itemsPatients.filter(patient => patient.id ===idPatient)
        const namePatient = name.map(patient => patient.name)[0]
        return namePatient
    }

    const validateForm =() =>{
        let isValidForm = true

        if(isEmpty(formData.name)){
            setErrorName("Ingresa por favor un nombre para la cita.")
            isValidForm= false
        }
        if(isEmpty(formData.dateAndTime)){
            setErrorDateAndTime("Ingresa por favor una fecha para la cita.")
            isValidForm= false
        }

        if(isEmpty(formData.address)){
            setErrorAddress("Ingresa una direccion ó clinica.")
            isValidForm= false
        }

        if(isEmpty(formData.idPatient)){
            toasRef.current.show("Debes elegir un paciente para la cita.",3000)
            isValidForm = false
        }

        return isValidForm

    }
    
    

    return (
        <ScrollView style={styles.viewContainer}>

            {/* Input name */}
            <FormAddInput
                placeholderInput="Nombre o descripcion de la cita."
                labelInput="Nombre Cita"
                onChange={onChange}
                keyItemFormData="name"
                keyError={errorName}
                iconName="commenting-o"
                isMultiline={false}
                valueField={formData.name}
            />

            {/* Input Date and Time */}
            <InputCalendarForm 
                formData={formData}
                setFormData={setFormData}
                errorDateAndTime={errorDateAndTime}
                
            />

            {/*Input address and location*/}
            <InputMapForm 
                onChange={onChange}
                errorAddress={errorAddress}
                setVisibleMap={setVisibleMap}
                locationAppointment={locationAppointment}
            />

            {/*Input  patient*/}
            <InputMultiSelect 
                items={itemsPatients}
                setSelectedItem ={setSelectedPatient}
                selectedItems = {selectedPatient}
                formData={formData}
                setFormData={setFormData}
                keyFormData="idPatient"
                mainText="Paciente..."
                searchText= "Buscar Paciente..."
                keyHideTags={true}
                isSingleSelection={true}
                toasRef={toasRef}
            />

            {/* Input doctor */}
            <FormAddInput 
                placeholderInput="Nombre del medico."
                labelInput="Medico"
                onChange={onChange}
                keyItemFormData="doctor"
                keyError={errorDoctor}
                iconName="user-md"
                isMultiline={false}
                valueField={formData.doctor}
            />

            {/*Input  tags*/}
            <InputMultiSelect 
                items={itemsTags}
                setSelectedItem ={setIdTags}
                selectedItems = {idTags}
                formData={formData}
                setFormData={setFormData}
                keyFormData="idTags"
                mainText="Etiquetas..."
                searchText= "Buscar Etiqueta..."
                keyHideTags={false}
                isSingleSelection={false}
                toasRef={toasRef}
            />

            {/*Input  notes, */}
            <View style={styles.viewBody}>
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
            </View>

            {/*Input  images */}  
            <View style={styles.viewBody}>
                <Text style={styles.textImage}>Imagenes</Text>
                <UploadImage 
                    imagesSelected={imagesSelected}
                    setImagesSelected= {setImagesSelected}
                />
            </View>

            <MapAppointment 
                visibleMap={visibleMap}
                setVisibleMap={setVisibleMap}
                setLocationAppointment={setLocationAppointment}
                toasRef={toasRef}
            />

            <View style={styles.viewBody}>
                 <TouchableOpacity 
                    style={styles.btnSave}
                    onPress={addAppointment}
                >
                    <Text style={styles.textSave}>
                        Guardar Cita
                    </Text>
                </TouchableOpacity>
            </View>


        

          
            
        </ScrollView>
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



function InputCalendarForm({formData,setFormData,errorDateAndTime}){
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateSelected, setDateSelected] = useState("")

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = (datetime) => {
        setDatePickerVisibility(false);

      };
    
      const handleConfirm = (datetime) => {
        hideDatePicker();
        setDateSelected(moment(datetime).format('YYYY-MM-DD hh:mm A'))
        setFormData({...formData,"dateAndTime" : moment(datetime).format('YYYY-MM-DD hh:mm A')})
      };

    return(
        <View style={styles.viewBody}>
                    <TouchableOpacity
                        onPress={showDatePicker}
                    >
                    <Input 
                        placeholder="Fecha de la cita"
                        defaultValue={dateSelected}
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
                </View>
    )
}

function InputMapForm({onChange,errorAddress,setVisibleMap,locationAppointment}){

    return(
        <View style={styles.viewBody}>

            <Input 
                placeholder="Dirección de la cita"
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                label="Dirección ó Clinica"
                rightIcon ={{
                    type:"font-awesome",
                    name: locationAppointment ? "check-square-o"  : "map-marker",
                    color: locationAppointment ? "#22af1b": "#c2c2c2",
                    onPress:() => setVisibleMap(true)
                }}
            />
        </View>
    )
}

function InputMultiSelect(
    {
        items,
        setSelectedItem,
        selectedItems,
        formData,
        setFormData,
        keyFormData,
        mainText,
        searchText,
        keyHideTags,
        isSingleSelection,
        toasRef
    }){


    const onChangeSingle =(selectedItems)=>{
        setSelectedItem(selectedItems)
        setFormData({...formData, [keyFormData] : selectedItems[0]})
    }

    const onChangeMultiple =(selectedItems)=>{
        if(size(selectedItems)>3){
            toasRef.current.show("Solo puedes elegir 3 etiquetas por cita",3000)
            return
        }
        /*Convert the selectedItems array to an object*/
        const objectItems = {...selectedItems}


        setSelectedItem(selectedItems)
        setFormData({...formData, [keyFormData] : objectItems})
    }

    return(
        <View style={styles.viewBody}>
            <MultiSelect 
                    hideTags={keyHideTags}
                    items={items}
                    uniqueKey="id"
                    displayKey="name"
                    onSelectedItemsChange={isSingleSelection ? onChangeSingle : onChangeMultiple}
                    selectedItems={selectedItems}
                    selectText={mainText}
                    searchInputPlaceholderText={searchText}
                    tagRemoveIconColor="#f4544c"
                    tagBorderColor="#067da4"
                    tagTextColor="#877f7e"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    searchInputStyle={styles.searchInputMultiSelect}
                    submitButtonColor="#047ca4"
                    submitButtonText="Seleccionar"
                    single={isSingleSelection}
                    selectedItemIconColor="#047ca4"
                    selectedItemTextColor= "#047ca4"
                    styleTextDropdown={styles.textDropdownMultiSelect}
                    styleTextDropdownSelected={styles.textDropdownSelectedMultiSelect}
                    styleDropdownMenuSubsection={styles.dropdownMenuSubsectionMultiSelect}


                />
        </View>
    )
}

function UploadImage({imagesSelected,setImagesSelected}){

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
                    style:"cancer"
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

    return(
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

                map(imagesSelected,(imageRestaurant, index) => (
                    <Avatar 
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageRestaurant}}  
                        onPress={() => removeImage(imageRestaurant)}  
                    />
                ))
            }


        </ScrollView>
    )

}

function MapAppointment({visibleMap,setVisibleMap,setLocationAppointment,toasRef}){
    const [newRegionAppointment, setNewRegionAppointment] = useState(null)

    useEffect(() => {
        (async()=>{
            const response = await getCurrentLocation()
            if(response.status){
                setNewRegionAppointment(response.location)
            
            }
        })()
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

const styles = StyleSheet.create({

    viewContainer:{
        height: "100%",
        flex:1,
    },
    viewHeader:{
        flex:1,
        backgroundColor: "#047ca4",
        paddingVertical:15
    },
    
    title:{
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize:25,
        marginLeft:10 
    },
    icon:{
        // color: "#c1c1c1",
        marginRight:10
    },
    viewBody:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%"
    },
    viewInput:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%",
        marginTop:15
    },
    textArea:{
        height: 100,
        width: "100%",
        marginTop:15
    },
    viewImage:{
        flexDirection :"row",
        marginHorizontal:10,
        paddingBottom: 10
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
    miniatureStyle:{
        width: 80,
        height: 80,
        marginRight: 10
    },
    textImage:{
        marginLeft:10,
        fontSize: 18,
        color:"#8D99A3",
        marginTop:20
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
    mapStyle:{
        width: "100%",
        height: 550
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
    }
    
})
