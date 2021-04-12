import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Social from '../screens/social/Social'
import AddSocial from '../screens/social/AddSocial'

const Stack = createStackNavigator()

export default function SocialStack() {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="social"
                component={Social}
                options={{
                    headerShown:false
                }}  
           />

           <Stack.Screen
                name="add-social"
                component={AddSocial}
                options={{
                    title:"Añadir Integrante",
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
