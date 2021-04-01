import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Profile from '../screens/profile/Profile'

const Stack = createStackNavigator()

export default function ProfileStack({setLogged}) {

    return (
       <Stack.Navigator>


            <Stack.Screen 
                name="profile"
                options={{
                    headerShown:false
                 }}
            >
                    {props => <Profile {...props} setLogged={setLogged} />}
            </Stack.Screen>
            
       </Stack.Navigator>
    )
}

