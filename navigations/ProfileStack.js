import React,{useState,useEffect} from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Profile from '../screens/profile/Profile'
import Login from '../components/profile/Login'
import Register from '../components/profile/Register'
import { getCurrentUser } from '../utils/actions'

const Stack = createStackNavigator()

export default function ProfileStack({setLogged}) {

    return (
       <Stack.Navigator>
           <Stack.Screen
                name="profile"
                component={ () => <Profile setLogged={setLogged} /> }
                options={{

                           headerShown:false
                        }}
           />
          
       </Stack.Navigator>
    )
}

