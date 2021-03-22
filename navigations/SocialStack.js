import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Social from '../screens/Social'

const Stack = createStackNavigator()

export default function SocialStack() {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="social"
                component={Social}
                options={{
                            title:"Mi Circulo Social",
                            headerTitleAlign:"center"
                        }}
           />
       </Stack.Navigator>
    )
}
