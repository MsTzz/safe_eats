import { optEnum } from '@shopify/react-native-skia/lib/typescript/src/skia/web/Host';
import React from 'react';
import { _View, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';

export default function Search() {
  const { hasPermission } = useCameraPermission();

  
 
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c4ceb0',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#566332',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
