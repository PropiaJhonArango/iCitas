import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Appointments from '../screens/Appointments'


const Stack = createStackNavigator()

export default function AppointmentsStack() {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="appointments"
                component={Appointments}
                options={{title:"Citas Activas"}}
           />
       </Stack.Navigator>
    )
}
