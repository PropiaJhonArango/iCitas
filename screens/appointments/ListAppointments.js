import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View,ActivityIndicator,TouchableOpacity,FlatList } from 'react-native'
import { Badge, Icon, Image } from 'react-native-elements'
import { map, size } from 'lodash'
import moment from 'moment'
import { useFocusEffect } from '@react-navigation/native'

import { getAllTags, getCurrentUser } from '../../utils/actions'


export default function ListAppointments({appointments,navigation, handleLoadMore}) {


    return (
        <View>
            <FlatList
                data={appointments}
                keyExtractor={(item,index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(appointment) => (
                    <Appointment appointment={appointment} navigation={navigation} />
                )}
            />
        </View>
    )
}

function Appointment({appointment,navigation}){
    const {id,namePatient,name,dateAndTime,address, images,idTags,idCreator} = appointment.item
    const imageAppointment = size(images)>0 && images[0]
    const [userUpdated, setUserUpdated] = useState(getCurrentUser())
    const [userTags, setUserTags] = useState([])
    const [appointmentTags, setAppointmentTags] = useState([])

    const [idTagsArray, setIdTagsArray] = useState([])



    const tagsData=[]

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                const responseTags = await getAllTags(idCreator)
                
                setIdTagsArray(Object.values(idTags))
    
                if (responseTags.statusResponse) {
                    const dataResult = responseTags.tags.map(doc => ({id: doc.id,tagColor:doc.tagColor, tagName: doc.tagName}))
                    dataResult.sort((a,b) => a.tagName.localeCompare(b.tagName))
                    setUserTags(dataResult)
      
                    idTagsArray.forEach(tag => {
                        tagsData.push(...getDetailsTag(tag))
                    })
                    setAppointmentTags(tagsData)

    
                }
            }
            getData()
        }, [appointmentTags])
    )





    const getDetailsTag =(idTag) =>{

        const tags = userTags.filter(tag => tag.id ===idTag)
        const tagDetail =  tags.map(tag =>  ({id: tag.id, color: tag.tagColor, name: tag.tagName}))
        return tagDetail

    }


    const goAppointment =()=>{
        navigation.navigate("appointment",{appointment})
    }

    return(
        <TouchableOpacity
            onPress={goAppointment}
        >
            <View style={styles.viewAppointment}>
                <View style={styles.viewAppointmentImage}>
                        <Image
                            resizeMode="cover"
                            PlaceholderContent={<ActivityIndicator color="#fff"/>}
                            source={
                                namePatient.substr(0, 4) === "Yo ("
                                ? {uri: userUpdated.photoURL}
                                : require("../../assets/avatar-default.jpg")
                            }

                            style={styles.imageAppointmentStyle}
                        />
                </View>
                <View style={styles.viewInformation}>
                     <Text style={styles.appointmentTitle}>
                        {
                            namePatient.substr(0, 4) === "Yo ("
                            ? "Yo ("+userUpdated.displayName+")"
                            : namePatient
                        }
                    </Text>
                    <Text style={styles.appointmentInformation}>{name}</Text>
                    <Text style={styles.appointmentInformation}>{ moment(dateAndTime.toDate()).format('YYYY-MM-DD hh:mm A')}</Text>
                    <Text style={styles.appointmentInformation}>
                        {
                            size(address) > 20
                                ? `${address.substr(0, 20)}...`
                                : address
                        }
                    </Text>
                </View>


                <View style={styles.viewTagsContainer}>

                    {
                        
                        appointmentTags.map((tag)=>( 

                            // console.log(tag)
                            <View style={styles.viewTags}
                                key={tag.id}
                            >
                                <Badge
                                   
                                    value={ 
                                        <View style={styles.viewTagsElements}>
                                            <Icon
                                                type="font-awesome"
                                                name="tags"
                                                size={17}
                                                iconStyle={styles.iconStyleTags}
                                            />
                                            <Text style={styles.textStyleTags}>
                                                {
                                                     size(tag.name) > 10
                                                     ? `${tag.name.substr(0, 10)}...`
                                                     : tag.name
                                                    
                                                }
                                            </Text>
                                        </View>
                                    }
                                    badgeStyle={[styles.badge,{
                                        backgroundColor: tag.color,
                                    }]}

                                />
                            </View>
                        ))
                            
                    }

                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewAppointment: {
        flexDirection: "row",
        margin: 10
    },
    viewAppointmentImage: {
        marginRight: 10
    },
    imageAppointmentStyle: {
        width: 90,
        height: 90,
        borderRadius:50
    },
    appointmentTitle: {
        fontWeight: "bold"
    },
    appointmentInformation: {
        paddingTop: 2,
        color: "grey",
    },
    viewTagsContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        marginRight:5
    },
    viewTagsElements:{
        flex:1,
        flexDirection:"row",
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainerStyle:{
        marginRight: 5
    },
    badge:{
        height: 30,
        paddingVertical: 3,
        paddingHorizontal: 6

    },
    iconStyleTags:{
        color:"white",
        marginRight:5
    },
    textStyleTags:{
        color:"white"
    },
    viewTags:{
        marginBottom:2
    },
    viewInformation:{
        justifyContent:"center"
    }

})
