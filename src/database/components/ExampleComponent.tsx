import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { testConnection } from '../api';

const ExampleComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await testConnection();
      console.log(response);
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Check the console for server response.</Text>
    </View>
  );
};

export default ExampleComponent;