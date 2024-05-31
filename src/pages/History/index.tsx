import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Pagina de histórico</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c4ceb0',
    
  
  },
  
  Text:{
    fontSize: 25,
    fontWeight: 'bold'
  }
});
