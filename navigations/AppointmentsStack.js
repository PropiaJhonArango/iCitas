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
                            fontWeight: "bold",
                            fontSize:20,
                        },
                        headerStyle:{
                            backgroundColor: "#047ca4",
                            borderBottomLeftRadius:40,
                            borderBottomRightRadius:40,
                           
                        },
                        headerTintColor: "#FFFFFF",
                        headerTitleAlign:"center",
                }}        
           />
           <Stack.Screen
                name="appointment"
                component={Appointment}

                options={{

                title: "Editar Cita",
                headerTitleStyle:{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize:20,
                },
                headerStyle:{
                    backgroundColor: "#047ca4",
                    borderBottomLeftRadius:40,
                    borderBottomRightRadius:40,
                },
                headerTintColor: "#FFFFFF",
                headerTitleAlign:"center",
                }}
            />

       </Stack.Navigator>
    )
}

