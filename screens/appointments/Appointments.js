import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'


import ListAppointments from './ListAppointments'
import Loading from '../../components/Loading'
import { getAppointments, getMoreAppointments } from '../../utils/actions'

export default function Appointments({navigation}) {
    const [startAppointment, setStartAppointment] = useState(null)
    const [user, setUser] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

  

    const limitAppointments = 7

    useFocusEffect(
        useCallback(() => {
            const getData = async()=> {
                setLoading(true)
                console.log("Esta En El Primero")
                const response = await getAppointments(limitAppointments)
                if (response.statusResponse) {
                    setStartAppointment(response.startAppointment)
                    setAppointments(response.appointments)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        console.log("Esta en el segundo")
        if(!startAppointment) {
            return
        }

        setLoading(true)
        const response = await getMoreAppointments(limitAppointments, startAppointment)
        if(response.statusResponse){
            setStartAppointment(response.startAppointment)
            setAppointments([...appointments, ...response.appointments])
        }
        setLoading(false)
    }
    
    return (
        <View style={styles.viewBodyAppointments}>
            {
                size(appointments) > 0 ?
                (
                    <ListAppointments
                        appointments={appointments}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ): 
                (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No existen citas</Text>
                        <Text style={styles.notFoundText}>¡Pulsa el boton para añadir una nueva cita!</Text>
                    </View>
                )
            }
            <Icon
                type="font-awesome"
                name="plus"
                color="#f4544c"
                reverse={true}
                containerStyle={styles.btnContainer}
                size={30}
                onPress={()=> navigation.navigate("add-appointment")}
            />
            <Loading isVisible={loading} text="Cargando Citas..."/>
           
        </View>
    )
}

const styles = StyleSheet.create({
    viewBodyAppointments:{
        flex:1
    },
    btnContainer:{
        position: "absolute",
        bottom:60,
        right:15,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    notFoundView : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText : {
        fontSize: 18,
        fontWeight: "bold"
    }
})
