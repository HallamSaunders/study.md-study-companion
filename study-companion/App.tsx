import React, { useEffect, useState } from 'react';
import { NavigationContainer, ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';


import { Feather } from '@expo/vector-icons';

//Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext';

//Screens
import LoginScreen from './app/auth/LoginScreen';
import CalendarScreen from './app/(tabs)/Calendar';
import MetricsScreen from './app/(tabs)/Metrics';
import NotesScreen from './app/(tabs)/Notes';
import ProfileScreen from './app/(tabs)/Profile';
import TimerScreen from './app/(tabs)/Pomodoro';
import ProfileSettings from './app/screens/ProfileSettings';

//Color schemes
import { useColorScheme } from './components/useColorScheme';
import Colors from './constants/Colors';

//Stacks and tabs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function InsideTabLayout() {
  const colourScheme = useColorScheme();
  const themeColors = colourScheme === 'dark' ? Colors.dark : Colors.light;
  const iconSize: number = 28;

  return (
    <Tab.Navigator initialRouteName="Timer" screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ 
        title: "Calendar",
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return <Feather
            name="calendar"
            color={focused ? themeColors.tabIconSelected : themeColors.tabIconDefault}
            size={iconSize}  
          />
        }
      }}/>
      <Tab.Screen name="Notes" component={NotesScreen} options={{ 
        title: "Notes",
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return <Feather
            //name={focused ? "book-open" : "book"}
            name='book-open'
            color={focused ? themeColors.tabIconSelected : themeColors.tabIconDefault}
            size={iconSize}  
          />
        }
      }}/>
      <Tab.Screen name="Timer" component={TimerScreen} options={{ 
        title: "Timer",
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return <Feather
            name="clock"
            color={focused ? themeColors.tabIconSelected : themeColors.tabIconDefault}
            size={iconSize}  
          />
        }
      }}/>
      <Tab.Screen name="Metrics" component={MetricsScreen} options={{ 
        title: "Metrics",
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return <Feather
            //name={focused ? "bar-chart" : "bar-chart-2"}
            name='bar-chart'
            color={focused ? themeColors.tabIconSelected : themeColors.tabIconDefault}
            size={iconSize}  
          />
        }
      }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ 
        title: "Profile",
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return <Feather
            name="user"
            color={focused ? themeColors.tabIconSelected : themeColors.tabIconDefault}
            size={iconSize}  
          />
        }
      }}/>
    </Tab.Navigator>
  );
}

function AuthDependentLayout() {
  //Use auth provider to determine auth status of user
  const { user, loading } = useAuth();
  if (loading) {
    return null; // Or a loading spinner
  }

  //Safe area insets hook
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Stack.Navigator>
          {user ? (
            <Stack.Screen name='Tabs' component={InsideTabLayout} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
          )}
          <Stack.Screen name='ProfileSettings' component={ProfileSettings} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  //Get color scheme and log it
  const colorScheme = useColorScheme();
  console.log('Color scheme: ', colorScheme);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar />
      <SafeAreaProvider>
        <AuthProvider>
          <AuthDependentLayout />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}