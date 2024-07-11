
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import ExampleComponent from './src/database/components/ExampleComponent';

export default function App() {
    return (
        <NavigationContainer>
            <Routes />
            <ExampleComponent />
        </NavigationContainer>
    );
};