import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { size } from 'lodash'

import { getCurrentUser, getSocialGroup,getMoreSocialGroup } from '../../utils/actions'
import Loading from '../../components/Loading'
import ListSocialGroup from './ListSocialGroup'


export default function Social({navigation}) {
    const [loading, setLoading] = useState(false)
    const [starSocialGroup, setStarSocialGroup] = useState(null)
    const [socialGroup, setSocialGroup] = useState([])



    const limitSocialGroup = 12



    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getSocialGroup(limitSocialGroup,getCurrentUser().uid)
                if (response.statusResponse) {
                    setStarSocialGroup(response.startSocialGroup)
                    setSocialGroup(response.socialGroup)
                }
                
                setLoading(false)
            }
            getData()
            
        }, [])
        
    )

    const handleLoadMore = async() => {
        if(!starSocialGroup) {
            return
        }

        const response = await getMoreSocialGroup(limitSocialGroup,getCurrentUser().uid, starSocialGroup)
        if(response.statusResponse){
            setStarSocialGroup(response.startSocialGroup)
            setSocialGroup([...socialGroup, ...response.socialGroup])
        }
    }


    return (
        <View style={styles.viewSocial}>
            <View style={styles.viewHeaderSocial} >
                <View>

                <Text style={styles.titleHeader}>Grupo Social</Text>
                </View>
            </View>
            {
                size(socialGroup) > 0 ?
                (
                    <ListSocialGroup 
                        socialGroup={socialGroup}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />

                ): 
                (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No tienes integrantes en tu circulo social</Text>
                        <Text style={styles.notFoundText}>¡Pulsa el boton para añadir un nuevo integrante!</Text>
                    </View>
                )
            }
            <Loading isVisible={loading} text="Cargando Integrantes..."/>
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
