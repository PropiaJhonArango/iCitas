import React,{useRef, useState} from 'react'
import { StyleSheet,} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'

import Loading from '../../components/Loading'
import AddAppointmentForm from '../../components/appointments/AddAppointmentForm'

export default function AddAppointment({navigation}) {

    const toasRef = useRef()
    const [loading, setLoading] = useState(false)

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <AddAppointmentForm setLoading={setLoading} toasRef={toasRef} navigation={navigation}/>
            <Loading isVisible={loading} text="Registrando Cita." />
            <Toast ref={toasRef} position= "bottom" opacity={0.9}  />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20
    }
})
