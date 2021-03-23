import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Navigation from '../../navigations/Navigation'

export default function Login({setLogueado}) {
    const navigation = useNavigation()

    const onSubmit = () =>{ //metodo asincrono
       
        setLogueado(true) //Para que recargue la pantalla una vez se actualice el nombre
        
        
    }

    return (
        <View>
            <Button
                title="Presioname"
                onPress={onSubmit}
            />
        </View>
    )
}

const styles = StyleSheet.create({})
