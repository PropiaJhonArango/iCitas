import React from 'react'
import { StyleSheet, Text, View,FlatList,TouchableOpacity,ActivityIndicator} from 'react-native'
import { Image } from 'react-native-elements'


export default function ListSocialGroup({socialGroup,navigation, handleLoadMore}) {

    return (
        <View>
            <FlatList 
                data={socialGroup}
                keyExtractor={(item,index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(socialMember) => (
                    <SocialGroupMember socialMember={socialMember} navigation={navigation} />
                )}
            />
        </View>
    )
}

function SocialGroupMember({socialMember,navigation}){
    const {id,idMemberUser,nameMember,numberIdentifyMember,phoneNumber,callingCode, images} = socialMember.item

    const goMemberDetails =()=>{

        navigation.navigate("member-details",{socialMember})
    }

    return(
        <TouchableOpacity
            onPress={goMemberDetails}
        >
            <View style={styles.viewSocial}>
                <View style={styles.viewSocialImage}>
                        <Image
                            resizeMode="cover"
                            PlaceholderContent={<ActivityIndicator color="#fff"/>}
                            source={
                                images
                                ? {uri: images}
                                : require("../../assets/avatar-default.jpg")
                            }

                            style={styles.imageSocialStyle}
                        />
                </View>
                <View style={styles.viewInformation}>
                    <Text style={styles.socialTitle}>{nameMember}</Text>
                    <Text style={styles.socialInformation}>Doc. {numberIdentifyMember}</Text>
                    <Text style={styles.socialInformation}>+{callingCode+" "+phoneNumber}</Text>
                </View>

            </View>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    viewSocial: {
        flexDirection: "row",
        margin: 10,
    },
    viewSocialImage: {
        marginRight: 10
    },
    imageSocialStyle: {
        width: 90,
        height: 90,
        borderRadius:50
    },
    socialTitle: {
        fontWeight: "bold"
    },
    socialInformation: {
        paddingTop: 2,
        color: "grey",
    },
    viewInformation:{
        justifyContent:"center"
    }
})
