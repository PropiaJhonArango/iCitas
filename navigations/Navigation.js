import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'


import SettingsAccountStack from './SettingsAccountStack'
import HistoryAppointmentsStack from './HistoryAppointmentsStack'
import SocialStack from './SocialStack'
import AppointmentsStack from './AppointmentsStack'
import ProfileStack from './ProfileStack'



const Tab = createBottomTabNavigator()

export default function Navigation() {

    const screenOptions =(route, color)=>{
        let iconName

        switch (route.name) {
            case "settingsAccount":
                iconName = "cogs"
                break;

            case "historyAppointment":
                iconName = "history"
            break;

            case "appointments":
                iconName = "heartbeat"
            break;

            case "social":
                iconName = "users"
            break;

            case "profile":
                iconName = "user"
            break;
              
        }

        return (
            <Icon 
                type="font-awesome"
                name={iconName}
                size={22}
                color={color}
            />
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                 initialRouteName = "appointments"
                 tabBarOptions={{
                     inactiveTintColor:"#047ca4",
                     activeTintColor: "#f4544c",
                                                       
                 }}
                screenOptions ={({route}) => ({
                    tabBarIcon: ({color}) => screenOptions(route,color)
                })}
            >

                <Tab.Screen
                    name="settingsAccount"
                    component ={SettingsAccountStack}
                    options={{
                        title: "Ajustes"
                        
                    }}
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
