import React, { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'

import { getAppointmentsExpired } from '../utils/actions'


export default function HistoryAppointments() {

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                const response = await getAppointmentsExpired()
                // if (response.statusResponse) {
                //     setStartAppointment(response.startAppointment)
                //     setAppointments(response.appointments)
                // }
                
                // setLoading(false)
            }
            getData()
            
        }, [])
        
    )

    
    return (
        <View>
            <Text>Historial Citas</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   
})
