import React, { useState,Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View,ScrollView,Picker } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import moment from 'moment'
import MultiSelect from 'react-native-multiple-select';
import { LogBox } from 'react-native';

 LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

import { getCurrentUser} from '../../utils/actions'




export default function AddAppointmentForm({setLoading}) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDateAndTime, setErrorDateAndTime] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPatient, setErrorPatient] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [idTags, setIdTags] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationClinic, setLocationClinic] = useState(null)

    
    return (
        <ScrollView>
            
            <FormAddAppointment 
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDateAndTime={errorDateAndTime}
                errorAddress={errorAddress}
                errorPatient={errorPatient}
                setIsVisibleMap={setIsVisibleMap}
                locationClinic={locationClinic}
            />


          
            
        </ScrollView>
    )
}

const defaultFormValues =() =>{
    return {
        name:"",
        dateAndTime: "",
        address:"",
        email:"",
        idPatient:"",
        notes:"",
        doctor:"",
        idTags: "57"
    }
}

function FormAddAppointment(
    {
        formData,
        setFormData,
        errorName,
        errorDateAndTime,
        errorAddress,
        errorPatient,
        setIsVisibleMap,
        locationClinic
    }
    
    ){

    const [selectedItems, setSelectedItems] = useState([])

    const items = [
        {
        id: '92iijs7yta',
        name: 'Yo '
    }, 
      {
        id: 'a0s0a8ssbsd',
        name: 'Madre'
      }, 
      {
        id: '16hbajsabsd',
        name: 'Padre'
      }
    ];
    

    const onChange =(e,type) =>{
        setFormData({...formData,[type] : e.nativeEvent.text})
    }

    const onSelectedItemsChange = (selectedItems) =>{
        setSelectedItems(selectedItems)
        console.log(selectedItems[0])
    }

    


    return(
       
        <View style={styles.viewContainer}>
            <View style={styles.viewBody}>
                <Input 
                    placeholder="Nombre o descripcion de la cita."
                    label="Nombre Cita"
                    defaultValue ={formData.name}
                    onChange ={(e) => onChange(e,"name")}
                    errorMessage={errorName}
                />
                <InputCalendarForm 
                    onChange={onChange}
                    errorDateAndTime={errorDateAndTime}
                />

                <InputMapForm 
                    onChange={onChange}
                    errorAddress={errorAddress}
                />
                
                
                
                <MultiSelect 
                    // hideTags
                    items={items}
                    uniqueKey="id"
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Paciente..."
                    searchInputPlaceholderText="Buscar Paciente..."
                    // onChangeInput={ (text)=> console.log(text)}
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: 'black',height: 50 }}
                    submitButtonColor="#047ca4"
                    submitButtonText="Seleccionar"
                    single={true}
                    selectedItemIconColor="#047ca4"
                    selectedItemTextColor= "#047ca4"
                    styleTextDropdown={{
                        marginLeft:10,
                        fontSize: 18,
                        color:"#8D99A3"
                        
                    }}
                    styleTextDropdownSelected={{
                        marginLeft:10,
                        fontSize: 18,
                        
                    }}
                    styleDropdownMenuSubsection={{
                        borderRadius: 10,
                        borderColor: "black",
                        height: 60,
                        backgroundColor: "transparent"

                    }}


                />

                
            </View>
   
                
            
            
            
    
        </View>
    )
}

function InputCalendarForm({onChange,errorDateAndTime}){
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
      };

    return(
        <View>
                    <TouchableOpacity
                        onPress={showDatePicker}
                    >
                    <Input 
                        placeholder="Fecha de la cita"
                        defaultValue={dateSelected}
                        label="Fecha/Hora"
                        editable={false}
                        errorMessage={errorDateAndTime}
                        onChange={(e) => onChange(e, "dateAndTime")}
                        rightIcon={
                            <TouchableOpacity
                                onPress={showDatePicker}
                            >
                                <Icon 
                                    type="font-awesome"
                                    name="calendar"
                                    iconStyle={styles.icon}
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

function InputMapForm({onChange,errorAddress}){
    const [addressSelected, setAddressSelected] = useState("")

    return(
        <View>

            <Input 
                placeholder="Dirección de la cita"
                defaultValue={addressSelected}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon ={{
                    type:"font-awesome",
                    name:"map-marker",
                    color: "#c2c2c2",
                    onPress:() => setIsVisibleMap(true)
                }}
            />
        </View>
    )
}

function InputMultiSelect({}){
    return(
        <View>

        </View>
    )
}

const styles = StyleSheet.create({

    viewContainer:{
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
        color: "#c1c1c1",
        marginRight:10
    },
    viewBody:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%"
    },
    
})
