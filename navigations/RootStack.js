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
                component={ () => <Login setLogged={setLogged}  /> }
                options={{
                    headerShown : false
                        }}
           />
           <Root.Screen
                name="register"
                component={ () => <Register setLogged={setLogged}/> }
                options={{
                    headerShown : false
                           
                        }}
           />
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
