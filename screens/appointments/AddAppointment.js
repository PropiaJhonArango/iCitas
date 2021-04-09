import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AddAppointmentForm from '../../components/appointments/AddAppointmentForm'

import Loading from '../../components/Loading'

export default function AddAppointment({navigation}) {
    const [loading, setLoading] = useState(false)

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <AddAppointmentForm setLoading={setLoading}/>
            <Loading isVisible={loading} text="Registrando Cita." />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        marginTop: 15
    }
})
