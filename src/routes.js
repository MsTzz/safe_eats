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
import InfoAPI from './pages/Scan/infoAPI';
import History from './pages/History';
import Profile from './pages/Profile';
import ButtonNew from './components/ButtonNew';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
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
                    bottom: 15,
                    left: 20,
                    right: 20,
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
                    
                    tabBarIcon: ({ focused, size, color }) => (
                        <Entypo name="home" size={focused ? 30 : size} color={color} />
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
                    tabBarIcon: ({ focused, size, color }) => (
                        <Feather name="search" size={focused ? 30 : size} color={color} />
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
                    tabBarStyle: {
                        backgroundColor: '#121212',
                         borderColor: 'transparent',
                         paddingBottom: 10,
                         paddingTop: 5,
                         height: 70,
                         borderRadius: 30,
                         bottom: 15,
                         left: 40,
                         right: 40,
                         position: 'absolute'  
                    },
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
                    tabBarIcon: ({ focused, size, color }) => (
                        <FontAwesome name="list" size={focused ? 30 : size} color={color} />
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
                    tabBarIcon: ({ focused, size, color }) => (
                        <FontAwesome name="user" size={focused ? 30 : size} color={color} />
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
 
function Routes() {
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
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Scan"
                component={Scan}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="API"
                component={InfoAPI}
                options={{ headerTitle: 'Detalhes do Produto' }}
            />
        </Stack.Navigator>
    );
}

export default Routes;
