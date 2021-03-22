import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Profile from '../screens/profile/Profile'
import Login from '../components/profile/Login'

const Stack = createStackNavigator()

export default function ProfileStack({userLogged}) {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="profile"
                // component={Profile}
                children ={ () => <Profile userLogged={userLogged} />}
                options={{

                            title: (  userLogged ?  "Perfil" : "iCitas"),
                            headerTitleAlign:"center"
                        }}
           />
           <Stack.Screen
                name="login"
                children ={ () => <Login/>}
                options={{
                            title: "Iniciar Sesión",
                            headerTitleAlign:"center"
                        }}
           />
       </Stack.Navigator>
    )
}

