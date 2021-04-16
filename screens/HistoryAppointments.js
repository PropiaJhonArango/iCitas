import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { size } from 'lodash'

import { getAppointmentsExpired,getCurrentUser,getMoreAppointmentsExpired } from '../utils/actions'
import ListAppointments from './appointments/ListAppointments'
import Loading from '../components/Loading'


export default function HistoryAppointments({navigation}) {
    const [startAppointment, setStartAppointment] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)


    const limitAppointments = 12

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getAppointmentsExpired(limitAppointments,getCurrentUser().uid)
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
        if(!startAppointment) {
            return
        }

        const response = await getMoreAppointmentsExpired(limitAppointments,getCurrentUser().uid, startAppointment)
        if(response.statusResponse){
            setStartAppointment(response.startAppointment)
            setAppointments([...appointments, ...response.appointments])
        }
    }

    
    return (
        <View style={styles.viewAppointments}>
            <View style={styles.viewHeaderAppointments} >
                <View>

                <Text style={styles.titleHeader}>Citas Antiguas</Text>
                </View>
            </View>
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
                        <Text style={styles.notFoundText}>No existen citas vencidas</Text>
                    </View>
                )
            }
            <Loading isVisible={loading} text="Cargando Citas..."/>
           
        </View>
    )
}


const styles = StyleSheet.create({
    viewAppointments:{
        flex:1,
        marginBottom: 60
    },
    btnContainer:{
        position: "absolute",
        bottom:-30,
        right:15,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,

    },
    notFoundView : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText : {
        fontSize: 18,
        fontWeight: "bold"
    },
    viewHeaderAppointments:{
        height: 60,
        width: "100%",
        backgroundColor: "#047ca4",
        borderBottomLeftRadius:40,
        borderBottomRightRadius:40,
        justifyContent: "center",
        alignItems: "center"
    },
    titleHeader:{
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize:20,
        
    }

})