import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HistoryAppointments from '../screens/HistoryAppointments'



const Stack = createStackNavigator()

export default function HistoryAppointmentsStack() {

    
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="historyAppointment"
                component={HistoryAppointments}
                options={{
                            title:"Citas Antiguas",
                            headerTitleAlign:"center"
                        }}
           />
       </Stack.Navigator>
    )
}
