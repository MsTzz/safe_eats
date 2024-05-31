import React from "react";
import { View, StyleSheet } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function ButtonNew({ focused, size, color }){
    return(
        <View style={[styles.container, {
            width : focused ? 65 : 60,
            height: focused ? 65 : 60
            }]}>
            <MaterialCommunityIcons name="barcode-scan" size={size} color={color} />
        </View>
    )

}



const styles = StyleSheet.create({
    container:{
        
        borderRadius: 15,
        justifyContent:'center',
        alignItems: 'center',
        marginBottom: 35,
        backgroundColor: '#566332',
        
    }

})