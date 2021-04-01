import React,{useState, useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet} from 'react-native'

import UserLogged from './UserLogged'
import UserGuest from './UserGuest'
import Loading from '../../components/Loading'
import { getCurrentUser } from '../../utils/actions'

export default function Profile({setLogged}) {
    
    const [login, setLogin] = useState(null)
    useFocusEffect(

        useCallback(() => {
            const user = getCurrentUser()
            user ? setLogin(true) : setLogin(false)
        }, [])

    )
    
    if(login == null){
        return <Loading isVisible={true} text="Cargando..." />
   }

   return login ? <UserLogged setLogged={setLogged}/> : <UserGuest />

}



const styles = StyleSheet.create({})
