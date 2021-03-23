import React,{useState, useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

import { closeSession } from '../../utils/actions'

export default function Profile({setLogged}) {

    return(
        <View>
            <Button
                title= "Cerrar Sesion"
                onPress={() =>{
                    closeSession()
                    setLogged(false)
                }}
            />
        </View>
    )


  

}

const styles = StyleSheet.create({})
