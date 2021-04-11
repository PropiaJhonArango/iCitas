import React from 'react'
import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import { Image } from 'react-native-elements'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { size } from 'lodash'


export default function ListAppointments({appointments, navigation, handleLoadMore}) {

    return (
        <View>
            <FlatList 
                data={appointments}
                keyExtractor={(item,index) => index.toString()}
                onEndReachedThreshold={0.8}
                onEndReached={handleLoadMore}
                // onEndReached={() => console.log("Hizo EndReached")}
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



    return(
        <TouchableOpacity>
            <View style={styles.viewAppointment}>
                <View style={styles.viewAppointmentImage}>
                        <Image
                            resizeMode="cover"
                            PlaceholderContent={<ActivityIndicator color="#fff"/>}
                            source={
                                require("../../assets/avatar-default.jpg")
                            }
                            style={styles.imageAppointmentStyle}
                        />
                </View>
                <View>
                     <Text style={styles.appointmentTitle}>{namePatient}</Text>
                    <Text style={styles.appointmentInformation}>{name}</Text>
                    <Text style={styles.appointmentInformation}>{dateAndTime}</Text>
                    <Text style={styles.appointmentInformation}>
                        {
                            size(address) > 60
                                ? `${description.substr(0, 60)}...`
                                : address
                        }
                    </Text>
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
        marginRight: 15
    },
    imageAppointmentStyle: {
        width: 90,
        height: 90
    },
    appointmentTitle: {
        fontWeight: "bold"
    },
    appointmentInformation: {
        paddingTop: 2,
        color: "grey",
    },


})
