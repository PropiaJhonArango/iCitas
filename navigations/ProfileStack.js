import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Profile from '../screens/profile/Profile'
import Login from '../components/profile/Login'
import Register from '../components/profile/Register'

const Stack = createStackNavigator()

export default function ProfileStack({userLogged}) {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="profile"
                children ={ () => <Profile userLogged={userLogged} />}
                options={{

                            title: (  userLogged ?  "Perfil" : "iCitas"),
                            headerTitleAlign:"center"
                        }}
           />
           <Stack.Screen
                name="login"
               component={Login}
                options={{
                            title: "Iniciar Sesión",
                            headerTitleAlign:"center"
                        }}
           />
           <Stack.Screen
                name="register"
                component={Register}
                options={{
                            title: "Registrate",
                            headerTitleAlign:"center"
                        }}
           />
       </Stack.Navigator>
    )
}

