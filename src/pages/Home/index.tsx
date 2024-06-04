import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';


export default function Home() {
  
  
  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pagina Home</Text>
      <Pressable
        onPress={() => {
        openSettings();
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Abrir config.</Text>
      </Pressable>
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
