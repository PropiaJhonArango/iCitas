import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function Social({navigation}) {
    return (
        <View style={styles.viewSocial}>
        <View style={styles.viewHeaderSocial} >
            <View>

            <Text style={styles.titleHeader}>Grupo Social</Text>
            </View>
        </View>
        {/* {
            size(appointments) > 0 ?
            (
                <ListAppointments
                    appointments={appointments}
                    navigation={navigation}
                    handleLoadMore={handleLoadMore}
                />
            ): 
            (
                <View style={styles.notFoundView}>
                    <Text style={styles.notFoundText}>No existen citas</Text>
                    <Text style={styles.notFoundText}>¡Pulsa el boton para añadir una nueva cita!</Text>
                </View>
            )
        }
        <Icon
            type="font-awesome"
            name="plus"
            color="#f4544c"
            reverse={true}
            containerStyle={styles.btnContainer}
            size={30}
            onPress={()=> navigation.navigate("add-appointment")}
        />
        <Loading isVisible={loading} text="Cargando Citas..."/> */}
        <Icon
            type="font-awesome"
            name="plus"
            color="#f4544c"
            reverse={true}
            containerStyle={styles.btnContainer}
            size={30}
            onPress={()=> navigation.navigate("add-social")}
        />
       
    </View>
    )
}

const styles = StyleSheet.create({

    viewSocial:{
        flex:1,
        marginBottom: 60
    },
    viewHeaderSocial:{
        height: 60,
        width: "100%",
        backgroundColor: "#047ca4",
        borderBottomLeftRadius:40,
        borderBottomRightRadius:40,
        justifyContent: "center",
        alignItems: "center"
    },
    titleHeader:{
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize:20,
        
    },
    btnContainer:{
        position: "absolute",
        bottom:-30,
        right:15,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,

    },
})
