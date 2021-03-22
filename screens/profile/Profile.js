import React,{useState,useEffect, useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'

import { getCurrentUser } from '../../utils/actions'
import UserLogged from './UserLogged'
import UserGuest from './UserGuest'

export default function Profile() {

    const [login, setLogin] = useState(null)

    useFocusEffect(

        useCallback(() =>{
            const user = getCurrentUser()
            user ? setLogin(true) : setLogin(false)
        })
    )

    if(login == null){
        return <Text>Cargando....</Text>
   }


   return login ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})
