import React, {useEffect} from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './pages/Home';
import Scan from './pages/Scan';
import History from './pages/History';
import Profile from './pages/Profile';
import Search from './pages/Search';


import ButtonNew from "./components/ButtonNew";

import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();


export default function Routes(){
    return(
       
        <Tab.Navigator
            screenOptions={{
                tabBarStyle:{

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
                
                headerStyle: { 
                    backgroundColor: '#c4ceb0',
                    
                    
                }, 
                headerTitleStyle: {
                    fontWeight: 'bold',
                    
                },
                
            }}
        >
            
            <Tab.Screen 
            name="Home" 
            component={Home} 
            options={{
                
                tabBarIcon: ({ size, color}) => (
                    <Entypo name="home" size={size} color={color} />
                )
            }}
            
            />

            <Tab.Screen 
            name="Procurar" 
            component={Search}
            
            options={{
                tabBarIcon: ({ size, color}) => (
                    <Feather name="search" size={size} color={color} />
                )
            }}
            />

            <Tab.Screen 
            name="Scan" 
            component={Scan}
            options={{
                tabBarShowLabel: 'false',
                tabBarLabel: '',
                tabBarIcon: ({ focused, size, color}) => (
                  <ButtonNew size={size} color={color} focused={focused} />  
                )
            }} 
            />

            <Tab.Screen 
            name="Historico" 
            component={History}
            options={{
                tabBarIcon: ({ size, color}) => (
                    <FontAwesome name="list" size={size} color={color} />
                )
            }}  
            />

            <Tab.Screen 
            name="Perfil" 
            component={Profile} 
            options={{
                tabBarIcon: ({ size, color}) => (
                    <FontAwesome name="user" size={size} color={color} />
                )
            }} 
            />

        </Tab.Navigator>

    )
}