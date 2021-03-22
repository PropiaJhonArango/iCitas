import React,{useState, useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'

import { getCurrentUser } from '../../utils/actions'
import UserLogged from './UserLogged'
import UserGuest from './UserGuest'
import Loading from '../../components/Loading'

export default function Profile({userLogged}) {

    // const [login, setLogin] = useState(null)

    // useFocusEffect(

    //     useCallback(() =>{
    //         const user = getCurrentUser()
    //         user ? setLogin(true) : setLogin(false)
    //     })
    // )

    if(userLogged == null){
        return <Loading  isVisible={true} text ="Cargando..." />
    }


   return userLogged ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})
