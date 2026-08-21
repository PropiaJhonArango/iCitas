import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Appointments from '../screens/appointments/Appointments'
import AddAppointment from '../screens/appointments/AddAppointment'
import Appointment from '../screens/appointments/Appointment'



const Stack = createStackNavigator()

export default function AppointmentsStack() {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="appointments"
                component={Appointments}
                options={{
                            headerShown:false
                        }}  
                
           />
           <Stack.Screen
                name="add-appointment"
                component={AddAppointment}
                options={{
                        title:"Añadir Cita",
                        headerTitleStyle:{
                            color: "#FFFFFF",
                            fontWeight: "800",
                            fontSize: 18,
                            letterSpacing: 0.2,
                        },
                        headerStyle:{
                            backgroundColor: "#357288",
                            borderBottomLeftRadius: 22,
                            borderBottomRightRadius: 22,
                            elevation: 8,
                            shadowColor: "#357288",
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.35,
                            shadowRadius: 8,
                        },
                        headerTintColor: "#FFFFFF",
                        headerTitleAlign:"center",
                        headerRightContainerStyle: {
                            paddingRight: 10,
                        },
                        cardStyle: {
                            backgroundColor: "#eceae6",
                        },
                }}
           />
           <Stack.Screen
                name="appointment"
                component={Appointment}
                options={{
                title: "Editar Cita",
                headerTitleStyle:{
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: 18,
                    letterSpacing: 0.2,
                },
                headerStyle:{
                    backgroundColor: "#357288",
                    borderBottomLeftRadius: 22,
                    borderBottomRightRadius: 22,
                    elevation: 8,
                    shadowColor: "#357288",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 8,
                },
                headerTintColor: "#FFFFFF",
                headerTitleAlign:"center",
                headerRightContainerStyle: {
                    paddingRight: 10,
                },
                cardStyle: {
                    backgroundColor: "#eceae6",
                },
                }}
            />

       </Stack.Navigator>
    )
}

