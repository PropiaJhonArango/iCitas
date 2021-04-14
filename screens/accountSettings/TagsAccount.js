import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function TagsAccount({navigation}) {
    return (
        <View style={styles.viewTags}>

            <Icon
                type="font-awesome"
                name="plus"
                color="#f4544c"
                reverse={true}
                containerStyle={styles.btnContainer}
                size={30}
                onPress={()=> navigation.navigate("add-tags")}
            />
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
