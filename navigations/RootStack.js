import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet} from 'react-native'


import Login from '../components/profile/Login'
import Register from '../components/profile/Register'
import UserGuest from '../screens/profile/UserGuest'

const Root = createStackNavigator()

export default function RootStack({setLogged,navigation}) {


    return (
        <Root.Navigator
            initialRouteName="userGuest"
        >

            <Root.Screen
                name="login"
                options={{
                    headerShown : false
                        }}
            >
                    {props => <Login {...props} setLogged={setLogged} />}

            </Root.Screen>

            <Root.Screen
                name="register"
                options={{
                    headerShown : false
                        }}
            >
                    {props => <Register {...props} setLogged={setLogged} />}

            </Root.Screen>


           <Root.Screen 

                name="userGuest"
                component={UserGuest}
                options={{
                            headerShown : false
                        }}
           />
        </Root.Navigator>
    )
}

const styles = StyleSheet.create({})
