import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { addDocumentWithoutId, getCurrentUser } from '../../utils/actions'


export default function AddTagsForm({setLoading, toasRef,navigation}) {
    const [dataSelected, setDataSelected] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)

    const backgroundColors =["#f4544c","#067da4","#22af1b","#f87c44"]

    const addTag = async()=>{
        if(!validateForm()){
            return
        }

        setLoading(true)

        const tagInfo ={
            tagName: dataSelected.name,
            tagColor: dataSelected.color,
            ownerId: getCurrentUser().uid,
            createdDate: new Date()
        }

        const responseAddAppointment = await addDocumentWithoutId("UserTags",tagInfo)
        setLoading(false)

        if(!responseAddAppointment.statusResponse){
            toasRef.current.show("Error al guardar la etiqueta, intente nuevamente.",3000)
            return
        }
        navigation.navigate("tags")

    }

    const validateForm =() =>{
        let isValidForm = true

        if(isEmpty(dataSelected.name)){
            setErrorName("Ingresa por favor un nombre para la etiqueta")
            isValidForm= false
        }
      
        if(isEmpty(dataSelected.color)){
            setErrorName("Selecciona un color para la etiqueta")
            isValidForm= false
        }
        return isValidForm

    }
    


    const onChange =(e,type) =>{
        if(type !=="color"){
            setDataSelected({...dataSelected,[type] : e.nativeEvent.text})
        }else{
            setDataSelected({...dataSelected,[type] : e})
        }
    }

 
     

    return (
        <View style={styles.viewSettings}>

            <View style={styles.viewFooterSettings}>
                <View style={styles.viewFooterOptions}>
                    <Icon
                        type="font-awesome"
                        name="tags"
                        color={dataSelected.color}
                        size={120}
                    />
                    
                    <View style={styles.ViewFooterText}>
                        <Input 
                            placeholder="Nombre Etiqueta..."
                            onChange={(e) => onChange(e,"name")}
                            label="Nombre Etiqueta"
                            errorMessage={errorName}
                            rightIcon={{
                                type:"font-awesome",
                                name :"tag",
                                color: isEmpty(dataSelected.name) ? "#c2c2c2":"#22af1b"
                            }}
                            
                        />

                        <View style={styles.viewColors}>
                            <Text style={styles.textColor}>Color: </Text>
                            {
                                backgroundColors.map((color) =>(
                                    <TouchableOpacity 
                                        key={color}
                                        style={[styles.colorSelect,
                                            {backgroundColor: color}
                                        ]}
                                        onPress={() => onChange(color,"color") }
                                    />
                                ))
                                
                            }
                        </View>

                    </View>
                </View>
            </View>
            <View style={styles.viewBody}>
                 <TouchableOpacity 
                    style={styles.btnSave}
                    onPress={addTag}
                >
                    <Text style={styles.textSave}>
                        Guardar Etiqueta
                    </Text>
                </TouchableOpacity>
            </View>

            
          
        </View>
    )
}

const defaultFormValues =() =>{
    return {
        name: "",
        color: ""
    }
}



const styles = StyleSheet.create({
    viewSettings:{
        flex:1,
        alignItems: "center",
        justifyContent:"center"
   
    },
    viewFooterSettings:{
        alignItems:"center",
        marginTop: 20
    },
    viewFooterOptions:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center"
    },
    ViewFooterText:{
        justifyContent: "center",
        alignItems:"center",
        marginLeft:15,
        width: "50%"
    },
    footerTextTitle:{
        color: "#057ca4",
        fontSize: 20,
        fontWeight:"bold"
    },
    footerText:{
        fontSize: 15,
    },
    
    colorSelect:{
        width: 30,
        height: 30,
        borderRadius:50,
        marginHorizontal:2
    },
    viewColors:{
        flexDirection: "row",
        alignItems: "center"
    },
    textColor:{
        fontSize: 16,
        fontWeight:"bold"
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
    viewBody:{
        width: "90%",
        alignSelf:"center",
        maxHeight: "100%",
        marginTop:20

    },
})
