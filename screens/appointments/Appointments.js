import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'



import { getAppointments, getMoreAppointments } from '../../utils/actions'
import ListAppointments from './ListAppointments'
import Loading from '../../components/Loading'

export default function Appointments({navigation}) {
    const [startAppointment, setStartAppointment] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

  

    const limitAppointments = 12


    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getAppointments(limitAppointments)
                if (response.statusResponse) {
                    setStartAppointment(response.startAppointment)
                    setAppointments(response.appointments)
                }
                
                setLoading(false)
            }
            getData()
            
        }, [])
        
    )

    

    const handleLoadMore = async() => {
        if(!startAppointment) {
            return
        }

        const response = await getMoreAppointments(limitAppointments, startAppointment)
        if(response.statusResponse){
            setStartAppointment(response.startAppointment)
            setAppointments([...appointments, ...response.appointments])
        }
    }


    
    return (
        <View style={styles.viewAppointments}>
            <View style={styles.viewHeaderAppointments} >
                <View>

                <Text style={styles.titleHeader}>Citas Activas</Text>
                </View>
            </View>
            {
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
            <Loading isVisible={loading} text="Cargando Citas..."/>
           
        </View>
    )
}
const styles = StyleSheet.create({
    viewAppointments:{
        flex:1,
        marginBottom: 60
    },
    viewHeaderAppointments:{
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
    notFoundView : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText : {
        fontSize: 18,
        fontWeight: "bold"
    },

})
