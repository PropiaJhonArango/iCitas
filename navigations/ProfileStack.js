import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Profile from '../screens/profile/Profile'
import Login from '../components/profile/Login'
import Register from '../components/profile/Register'

const Stack = createStackNavigator()

export default function ProfileStack({setLogged}) {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="profile"
                //component={Profile}
                component={ () => <Profile setLogged={setLogged} /> }
                options={{

                            title:"Perfil",
                            headerTitleAlign:"center"
                        }}
           />
          
       </Stack.Navigator>
    )
}

