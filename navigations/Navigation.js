import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'



import SettingsAccountStack from './SettingsAccountStack'
import HistoryAppointmentsStack from './HistoryAppointmentsStack'
import SocialStack from './SocialStack'
import AppointmentsStack from './AppointmentsStack'
import ProfileStack from './ProfileStack'


const Tab = createBottomTabNavigator()

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator>

                <Tab.Screen
                    name="settingsAccount"
                    component ={SettingsAccountStack}
                    options={{title: "Ajustes"}}
                />

                <Tab.Screen
                    name="historyAppointment"
                    component ={HistoryAppointmentsStack}
                    options={{title: "Historia"}}
                />

                <Tab.Screen
                    name="appointments"
                    component ={AppointmentsStack}
                    options={{title: "Citas"}}
                />
                <Tab.Screen
                    name="social"
                    component ={SocialStack}
                    options={{title: "Social"}}
                />
                
                <Tab.Screen
                    name="profile"
                    component ={ProfileStack}
                    options={{title: "Perfil"}}
                />
                 
            </Tab.Navigator>
        </NavigationContainer>
    )
}
