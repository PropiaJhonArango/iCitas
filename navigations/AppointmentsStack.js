import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Appointments from '../screens/appointments/Appointments'
import AddAppointment from '../screens/appointments/AddAppointment'
import { StyleSheet} from 'react-native'
import { Icon } from 'react-native-elements'


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
                headerStyle={styles.addAppointmentTitle}
                
                options={{
                        title:"Añadir Cita",
                        headerTitleStyle:{
                            color: "#FFFFFF",
                            fontWeight: "bold",
                            fontSize:25,
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

const styles = StyleSheet.create({
})
