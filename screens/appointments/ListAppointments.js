import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import { Badge, Icon, Image } from 'react-native-elements'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { size } from 'lodash'
import moment from 'moment'

import { getCurrentUser } from '../../utils/actions'


export default function ListAppointments({appointments,navigation, handleLoadMore}) {
    

    return (
        <View>
            <FlatList 
                data={appointments}
                keyExtractor={(item,index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(appointment) => (
                    <Appointment appointment={appointment} />
                )}
            />
        </View>
    )
}

function Appointment({appointment}){
    const {id,namePatient,name,dateAndTime,address, images,idTags} = appointment.item
    const imageAppointment = size(images)>0 && images[0]
    const [userUpdated, setUserUpdated] = useState(getCurrentUser())


    return(
        <TouchableOpacity>
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
                <View>
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
                    <View style={styles.viewTags}>

                        <Badge 
                            value={
                                <View style={styles.viewTagsElements}>
                                    <Icon 
                                        type="font-awesome"
                                        name="star"
                                        size={17}
                                        iconStyle={styles.iconStyleTags}
                                    />
                                    <Text style={styles.textStyleTags}>Etiqueta 1</Text>
                                </View>
                            }
                            badgeStyle={[styles.badge,{
                                backgroundColor: "#22af1b",
                            }]}
                            
                        />
                    </View>
                    <View style={styles.viewTags}>
                        <Badge 
                            value={
                                <View style={styles.viewTagsElements}>
                                    <Icon 
                                        type="font-awesome"
                                        name="star"
                                        size={17}
                                        iconStyle={styles.iconStyleTags}
                                    />
                                    <Text style={styles.textStyleTags}>Etiqueta 2</Text>
                                </View>
                            }
                            badgeStyle={[styles.badge,{
                                backgroundColor: "#f4544c",
                            }]}
                            
                        />
                    </View>

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
    }

})
