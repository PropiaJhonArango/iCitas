import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet} from 'react-native'

import Profile from '../screens/profile/Profile'
import Login from '../components/profile/Login'
import Register from '../components/profile/Register'
import UserGuest from '../screens/profile/UserGuest'
import Navigation from './Navigation'

const Root = createStackNavigator()

export default function RootStack({navigation, setLogueado}) {


    return (
       <Root.Navigator
            initialRouteName="userGuest"
       >   
           <Root.Screen
                name="login"
                component={ () => <Login setLogueado={setLogueado} /> }
                // children={()=><Login setLogueado={setLogueado}/>}
                options={{
                            title: "Iniciar Sesión",                          
                            headerTitleAlign:"center",
                            headerStyle: styles.header,
                            headerTitleStyle :styles.headerTitle,
                            headerTintColor: "white"
                        }}
           />
           <Root.Screen
                name="register"
                component={ () => <Register setLogueado={setLogueado} /> }
                // component={Register}
                options={{
                            title: "Registrate",
                            headerTitleAlign:"center",
                            headerStyle: styles.header,
                            headerTitleStyle :styles.headerTitle,
                            headerTintColor: "white"
                           
                        }}
           />
           <Root.Screen
                
                name="userGuest"
                component={UserGuest}
                options={{
                            title: "Iniciar Sesión",
                            headerShown : false
                        }}
           />

          
       </Root.Navigator>
    )
}

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#047ca4",
        
    },
    headerTitle:{
        color: "#FFFFFF",
    }
})
