import React from 'react'
import { StyleSheet, Text, View,FlatList,TouchableOpacity,ActivityIndicator} from 'react-native'
import { Icon, Image } from 'react-native-elements'


export default function ListTags({tags,navigation, handleLoadMore}) {

    return (
        <View>
            <FlatList 
                data={tags}
                keyExtractor={(item,index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(tag) => (
                    <Tag tag={tag} navigation={navigation} />
                )}
            />
        </View>
    )
}

function Tag({tag,navigation}){
    const {id,tagName,tagColor} = tag.item

    const goTag =()=>{

        navigation.navigate("tag", {tag})
    }

    return(
        <TouchableOpacity
            onPress={goTag}
        >
            <View style={styles.viewTags}>
                <View style={styles.viewTagsIcon}>
                    <Icon
                        type="font-awesome"
                        name="tags"
                        color={tagColor}
                        size={70}
                    />
                       
                </View>
                <View style={styles.viewInformation}>
                    <Text >
                        Etiqueta: <Text style={styles.tagTitle}>{tagName}</Text>
                    </Text>
                    
                    <View style={styles.ViewColor}>
                        <Text style={styles.textColor}>  Color: </Text>
                            <TouchableOpacity 
                                key={id}
                                style={[styles.colorSelect,
                                    {backgroundColor: tagColor}
                                ]}            
                            />
                        </View>
                </View>

            </View>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    viewTags: {
        flexDirection: "row",
        margin: 10,
        marginLeft: 30,
        alignContent:"center",
        marginTop:20
    },
    viewTagsIcon: {
        marginRight: 10
    },
    imageSocialStyle: {
        width: 90,
        height: 90,
        borderRadius:50,

    },
    tagTitle: {
        fontWeight: "bold"
    },
    viewInformation:{
        justifyContent:"center",
        alignItems:"center",
    },
    ViewColor:{
        alignContent:"center",
        flexDirection: "row"
    },
    colorSelect:{
        width: 20,
        height: 20,
        borderRadius:4,
        marginHorizontal:2,
        marginLeft:5

    },
})
