import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, TouchableOpacity, Image, Modal, StyleSheet, Text, View, Platform, Linking, Pressable } from 'react-native';
import { Camera, Code, useCameraDevice, useCameraFormat, useCameraPermission, useCodeScanner, Templates } from 'react-native-vision-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  Scan: undefined;
  API: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'API'
>;

type SignInProps = {
  navigation: SignInScreenNavigationProp;
};

export default function InfoAPI() {
  return (
    <View>
      <Text>Informações da API</Text>
    </View>
  )
}