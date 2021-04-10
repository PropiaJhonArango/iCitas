import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function Appointments({navigation}) {
    return (
        <View style={styles.viewBodyAppointments}>
            <Text>Estoy en Las Citas</Text>
            <Icon
                type="font-awesome"
                name="plus"
                color="#f4544c"
                reverse={true}
                containerStyle={styles.btnContainer}
                size={30}
                onPress={()=> navigation.navigate("add-appointment")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBodyAppointments:{
        flex:1
    },
    btnContainer:{
        position: "absolute",
        bottom:60,
        right:15,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    }
})
