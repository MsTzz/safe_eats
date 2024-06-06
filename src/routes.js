
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';

// Importe seus componentes de tela
import Welcome from './pages/Welcome';
import SignIn from './pages/Signin';
import Home from './pages/Home';
import Search from './pages/Search';
import Scan from './pages/Scan';
import History from './pages/History';
import Profile from './pages/Profile';
import ButtonNew from './components/ButtonNew';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RoutesInicio() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="Main"
                component={Routes}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

function Routes() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderColor: 'transparent',
                    paddingBottom: 10,
                    paddingTop: 5,
                    height: 70,
                    borderRadius: 25,
                    bottom: 14,
                    left: 14,
                    right: 14,
                    position: 'absolute'
                },
                tabBarActiveTintColor: '#ecf081',
                tabBarInactiveTintColor: '#c4ceb0',
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Entypo name="home" size={size} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#c4ceb0',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Tab.Screen
                name="Procurar"
                component={Search}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Feather name="search" size={size} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#c4ceb0',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Tab.Screen
                name="Scan"
                component={Scan}
                options={{
                    tabBarLabel: '',
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => (
                        <ButtonNew size={size} color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Historico"
                component={History}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome name="list" size={size} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#c4ceb0',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={Profile}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#c4ceb0',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Tab.Navigator>
    );
}

export default RoutesInicio;
