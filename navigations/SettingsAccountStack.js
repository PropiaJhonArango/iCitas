import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SettingsAccount from '../screens/accountSettings/SettingsAccount'
import TagsAccount from '../screens/accountSettings/TagsAccount'
import TagAccount from '../screens/accountSettings/TagAccount'
import AddTags from '../screens/accountSettings/AddTags'

const Stack = createStackNavigator()

export default function SettingsAccountStack() {
    return (
       <Stack.Navigator>
           <Stack.Screen
                name="settingsAccount"
                component={SettingsAccount}
                options={{
                    headerShown:false
                }}  
           />
           <Stack.Screen
                name="tags"
                component={TagsAccount}
                options={{
                    title:"Etiquetas",
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
                name="add-tags"
                component={AddTags}
                options={{
                    title:"Crear Etiqueta",
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
                name="tag"
                component={TagAccount}
                options={{
                    title:"Editar Etiqueta",
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
