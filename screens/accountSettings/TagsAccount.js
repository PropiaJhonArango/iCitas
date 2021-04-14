import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

import Loading from '../../components/Loading'
import ListTags from './ListTags'
import { getCurrentUser, getMoreTags, getTags } from '../../utils/actions'
import { size } from 'lodash'

export default function TagsAccount({navigation}) {

    const [starTags, setStartTags] = useState(null)
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false)

    const limitTags = 12

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getTags(limitTags,getCurrentUser().uid)
                if (response.statusResponse) {
                    setStartTags(response.startTags)
                    setTags(response.tags)
                }
                console.log("Datos: ",response.error)
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        if(!starTags) {
            return
        }

        const response = await getMoreTags(limitTags,getCurrentUser().uid, starTags)
        if(response.statusResponse){
            setStartTags(response.startTags)
            setTags([...tags, ...response.tags])
        }
    }


    return (
        <View style={styles.viewTags}>

            {
                size(tags) > 0 ?
                (
                    <ListTags
                        tags={tags}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ): 
                (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No existen etiquetas</Text>
                        <Text style={styles.notFoundText}>¡Pulsa el boton para añadir una nueva etiqueta</Text>
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
                onPress={()=> navigation.navigate("add-tags")}
            />
            <Loading isVisible={loading} text="Cargando Etiquetas..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewTags:{
        flex:1,
        marginBottom: 60
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
