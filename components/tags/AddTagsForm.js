import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'


export default function AddTagsForm({setLoading, toasRef,navigation}) {
    const [colorSelected, setColorSelected] = useState(defaultFormValues())

    const backgroundColors =["#f4544c","#067da4","#22af1b","#f87c44"]

    // const formData ={
    //     name: "",
    //     color: ""
    // }
console.log(colorSelected)

    const onChange =(e,type) =>{
        if(type !=="color"){

            setColorSelected({...colorSelected,[type] : e.nativeEvent.text})
        }else{
            setColorSelected({...colorSelected,[type] : e})
        }
    }

 
     

    return (
        <View style={styles.viewSettings}>

                    <View style={styles.viewFooterSettings}>
                        <View style={styles.viewFooterOptions}>
                            <Icon
                                type="font-awesome"
                                name="tags"
                                color={colorSelected.color}
                                size={120}
                            />
                           
                            <View style={styles.ViewFooterText}>
                                <Input 
                                    placeholder="Nombre Etiqueta..."
                                    onChange={(e) => onChange(e,"name")}
                                    label="Nombre Etiqueta"
                                />

                                <View style={styles.viewColors}>
                                    <Text style={styles.textColor}>Color: </Text>
                                    {
                                        backgroundColors.map((color) =>(
                                            <TouchableOpacity 
                                                key={color}
                                                style={[styles.colorSelect,
                                                {backgroundColor: color}]}
                                                onPress={() => onChange(color,"color") }
                                            />
                                        ))
                                       
                                    }
                                </View>

                            </View>
                        </View>
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
        marginBottom: 60,
        alignItems: "center",
   
    },
    viewFooterSettings:{
        justifyContent: "center",
        alignItems:"center",
        marginTop: 50
    },
    viewFooterOptions:{
        flexDirection: "row"
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
    }
})
