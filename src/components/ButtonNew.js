import React from "react";
import { View, StyleSheet } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function ButtonNew({ focused, size, color }){
    return(
        <View style={[styles.container, {borderRadius : focused ? 15 : 20}]}>
            <MaterialCommunityIcons name="barcode-scan" size={size} color={color} />
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        
        width: 60,
        height: 60,
        justifyContent:'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#566332',
        
    }

})