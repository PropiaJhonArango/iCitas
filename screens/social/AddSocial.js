import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../../components/Loading'

import AddSocialForm from '../../components/social/AddSocialForm'

export default function AddSocial({navigation}) {

    const toasRef = useRef()
    const [loading, setLoading] = useState(false)


    return (
        <KeyboardAwareScrollView style={styles.container}>
            <AddSocialForm setLoading={setLoading} toasRef={toasRef} navigation={navigation}/>
            <Loading isVisible={loading} text="Registrando Integrante." />
            <Toast ref={toasRef} position= "bottom" opacity={0.9}  />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20
    }
})
