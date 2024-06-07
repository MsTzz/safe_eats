import React from "react";
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ButtonNew({ focused, size, color }) {
    return (
        <View style={[styles.container, {
            width: focused ? 70 : 65,
            height: focused ? 70 : 65,
            borderRadius: focused ? 35 : 32.5, 
        }]}>
            <MaterialCommunityIcons 
                name="barcode-scan" 
                size={focused ? 30 : size} 
                color={color} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#566332',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 35,
    }
});
