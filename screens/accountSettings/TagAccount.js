import { isEmpty } from 'lodash'
import React, { useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { Alert } from 'react-native'

import Loading from '../../components/Loading'
import { deleteDocument, updateDocument } from '../../utils/actions'

export default function TagAccount({navigation, route}) {
    const toasRef = useRef()

    const {tag} = route.params
    const {id,tagColor,tagName} = tag.item

    const initialData ={
        color: tagColor,
        name: tagName
    }

    const backgroundColors =["#f4544c","#067da4","#22af1b","#f87c44"]
    
    const [dataSelected, setDataSelected] = useState(initialData)
    const [errorName, setErrorName] = useState(null)
    const [loading, setLoading] = useState(false)

    const modifyTag = async()=>{
        if(!validateForm()){
            return
        }
        setLoading(true)

        const finalData ={
            tagName: dataSelected.name,
            tagColor: dataSelected.color
        }

        const result = await updateDocument("UserTags",id,finalData)

        setLoading(false)

        if(!result.statusResponse){
            toasRef.current.show("Error al guardar la etiqueta, intente nuevamente.",3000)
            return
        }
        navigation.navigate("tags")

    }

    const onChange =(e,type) =>{
        if(type !=="color"){
            setDataSelected({...dataSelected,[type] : e.nativeEvent.text})
        }else{
            setDataSelected({...dataSelected,[type] : e})
        }
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

    const askDeleteTag = async()=>{
        Alert.alert(
            "Eliminar Etiqueta",
            "¿Estas seguro de eliminar la etiqueta?",
            [
                {
                    text:"No",
                    style:"cancel"
                },
                {
                    text:"Si",
                    onPress:() =>{
                        deleteTag()
                    }
                }
            ]
            ,{cancelable:true}
        )
    }

    const deleteTag = async() =>{
        const result = await deleteDocument("UserTags",id)

        if(!result.statusResponse){
            toasRef.current.show("Error al elimininar la etiqueta. ",3000)
            return
        }
        navigation.navigate("tags")
    }

    return (
        <View style={styles.viewSettings}>

            <Toast ref={toasRef} position= "bottom" opacity={0.9}  />
            <Loading isVisible={loading} text="Cargando..." />

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
                            defaultValue={dataSelected.name}
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
            <View style={[styles.viewBody,{
                         marginTop:20
                    }]}>
                 <TouchableOpacity 
                    style={styles.btnSave}
                    onPress={modifyTag}
                >
                    <Text style={styles.textSave}>
                        Guardar Etiqueta
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.btnDelete}
                    onPress={askDeleteTag}
                >
                    <Text style={styles.textSave}>
                        Eliminar 
                    </Text>
                </TouchableOpacity>
            </View>
           
          
        </View>
    )
}

const styles = StyleSheet.create({

    viewSettings:{
        flex:1,
        marginTop: 20
   
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
})
