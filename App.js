
import React,{useState,useEffect,useCallback} from 'react'

import Navigation from './navigations/Navigation'
import { NavigationContainer,useFocusEffect } from '@react-navigation/native'

import RootStack from './navigations/RootStack'
import { getCurrentUser } from './utils/actions'
import { LogBox} from 'react-native'


LogBox.ignoreAllLogs()

export default function App() {

  const [logueado, setLogueado] = useState(false)

  useEffect(() => {
    const user = getCurrentUser() 
    user ? setLogueado(true)  : setLogueado(false)
  }, [])


  return (
    <NavigationContainer>
      {
        logueado ? (<Navigation/>) : <RootStack setLogueado ={setLogueado}/>
      }
      </NavigationContainer>
  )

}

