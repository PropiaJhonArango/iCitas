import React from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function SettingsAccount() {

    return (
        <View style={styles.viewSettings}>
            <View style={styles.viewHeaderSettings}>
                <View>
                    <Text style={styles.titleHeader}>Ajustes Cuenta</Text>
                </View>
            </View>
            <View style={styles.viewBodySettings}>
                <Text style={styles.titleBody}>
                    Configura a tu gusto las diversas caracteristicas de iCitas
                </Text>
            </View>
            <TouchableOpacity>
                <View style={styles.viewFooterSettings}>
                    <View style={styles.viewFooterOptions}>
                        <Icon
                            type="font-awesome"
                            name="tags"
                            color= "#c2c2c2"
                            size={70}
                        />
                        <View style={styles.ViewFooterText}>
                            <Text style={styles.footerTextTitle}>Etiquetas</Text>
                            <Text style={styles.footerText}>Administra tus propias etiquetas</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.viewFooterSettings}>
                    <View style={styles.viewFooterOptions}>
                        <Icon
                            type="font-awesome"
                            name="bell-o"
                            color= "#c2c2c2"
                            size={70}
                        />
                        <View style={styles.ViewFooterText}>
                            <Text style={styles.footerTextTitle}>Notificaciones</Text>
                            <Text style={styles.footerText}>Define tiempo para tus notificaciones</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    

    )
}

const styles = StyleSheet.create({
    viewSettings:{
        flex:1,
        marginBottom: 60,
    },
    viewHeaderSettings:{
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
    viewBodySettings:{
        justifyContent: "center",
        alignItems:"center",
    },
    titleBody:{
        marginTop: 30,
        fontSize: 20,
        textAlign: "center",
    },
    viewFooterSettings:{
        justifyContent: "center",
        alignItems:"center",
        marginTop: 50
    },
    viewFooterOptions:{
        flexDirection: "row"
    },
    ViewFooterText:{
        justifyContent: "center",
        marginLeft:15
    },
    footerTextTitle:{
        color: "#057ca4",
        fontSize: 20,
        fontWeight:"bold"
    },
    footerText:{
        fontSize: 15,
    }
})
