
import React,{useState,useEffect} from 'react'

import Navigation from './navigations/Navigation'
import { NavigationContainer } from '@react-navigation/native'

import RootStack from './navigations/RootStack'
import { getCurrentUser } from './utils/actions'
import { LogBox} from 'react-native'

LogBox.ignoreAllLogs()

export default function App() {

  const [logueado, setLogged] = useState(false)

  useEffect(() => {
    const user = getCurrentUser() 
    user ? setLogged(true)  : setLogged(false)
  }, [])


  return (
    <NavigationContainer>
      {
        logueado ? <Navigation setLogged={setLogged}/> : <RootStack setLogged ={setLogged}/>
      }
      </NavigationContainer>
  )

}

