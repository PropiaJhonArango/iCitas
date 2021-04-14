import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SettingsAccount from '../screens/SettingsAccount'

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
       </Stack.Navigator>
    )
}
