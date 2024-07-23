// import React from 'react'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { Icon } from 'react-native-elements'

// import SettingsAccountStack from './SettingsAccountStack'
// import HistoryAppointmentsStack from './HistoryAppointmentsStack'
// import SocialStack from './SocialStack'
// import AppointmentsStack from './AppointmentsStack'
// import ProfileStack from './ProfileStack'

// const Tab = createBottomTabNavigator()

// export default function Navigation({setLogged}) {

//     const screenOptions =(route, color,focused)=>{
//         let iconName

//         switch (route.name) {
//             case "settingsAccount":
//                 iconName = "cogs"
//                 break;

//             case "historyAppointment":
//                 iconName = "history"
//             break;

//             case "appointments":
//                 iconName = "heartbeat"
//             break;

//             case "social":
//                 iconName = "users"
//             break;

//             case "profile":
//                 iconName = "user"
//             break;

//         }

//         return (
//             <Icon
//                 type="font-awesome"
//                 name={iconName}
//                 size= {focused ? 40 : 22}
//                 color={color}
//             />
//         )
//     }

//     return (

//             <Tab.Navigator
//                  initialRouteName ="appointments"

//                  tabBarOptions={{

//                      inactiveTintColor:"#047ca4",
//                      activeTintColor: "#f4544c",

//                  }}
//                 screenOptions ={({route}) => ({

//                     /*focused property indicates if the tab has the focus
//                     I send this property as a parameter to screenOptions to determine the size of the tab*/
//                     tabBarIcon: ({focused,color}) => screenOptions(route,color,focused)
//                 })}
//             >

//                 <Tab.Screen
//                     name="settingsAccount"
//                     component ={SettingsAccountStack}
//                     options={{
//                         title: "Ajustes"

//                     }}
//                 />

//                 <Tab.Screen
//                     name="historyAppointment"
//                     component ={HistoryAppointmentsStack}
//                     options={{title: "Historia"}}
//                 />

//                 <Tab.Screen
//                     name="appointments"
//                     component ={AppointmentsStack}
//                     options={{title: "Citas"}}
//                 />
//                 <Tab.Screen
//                     name="social"
//                     component ={SocialStack}
//                     options={{title: "Social"}}
//                 />

//                 <Tab.Screen
//                     name="profile"
//                     options={{title: "Perfil"}}
//                 >
//                     {props => <ProfileStack {...props} setLogged={setLogged} />}

//                 </Tab.Screen>

//             </Tab.Navigator>

//     )
// }

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";

import SettingsAccountStack from "./SettingsAccountStack";
import HistoryAppointmentsStack from "./HistoryAppointmentsStack";
import SocialStack from "./SocialStack";
import AppointmentsStack from "./AppointmentsStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default function Navigation({ setLogged }) {
  const screenOptions = (route, color, focused) => {
    let iconName;

    switch (route.name) {
      case "settingsAccount":
        iconName = "cogs";
        break;

      case "historyAppointment":
        iconName = "history";
        break;

      case "appointments":
        iconName = "heartbeat";
        break;

      case "social":
        iconName = "users";
        break;

      case "profile":
        iconName = "user";
        break;
    }

    return (
      <Icon
        type="font-awesome"
        name={iconName}
        size={focused ? 37 : 22}
        color={focused ? "#f4544c" : "#047ca4"}
      />
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="appointments"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) =>
          screenOptions(route, color, focused),
        tabBarActiveTintColor: "#f4544c",
        tabBarInactiveTintColor: "#047ca4",
      })}
    >
      <Tab.Screen
        name="settingsAccount"
        component={SettingsAccountStack}
        options={{ title: "Ajustes" }}
      />
      <Tab.Screen
        name="historyAppointment"
        component={HistoryAppointmentsStack}
        options={{ title: "Historia" }}
      />
      <Tab.Screen
        name="appointments"
        component={AppointmentsStack}
        options={{ title: "Citas" }}
      />
      <Tab.Screen
        name="social"
        component={SocialStack}
        options={{ title: "Social" }}
      />
      <Tab.Screen name="profile" options={{ title: "Perfil" }}>
        {(props) => <ProfileStack {...props} setLogged={setLogged} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
