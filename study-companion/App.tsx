import React, { useEffect, useState } from 'react';
import { NavigationContainer, ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Feather } from '@expo/vector-icons';

//Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase/firebase-config';

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

  return (
    <Tab.Navigator>
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Metrics" component={MetricsScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        headerRight: () => (
          <Link href='ProfileSettings' asChild>
            <Pressable>
              {({ pressed }) => (
                <Feather
                  name="settings"
                  size={25}
                  color={themeColors.tabIconDefault}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        )
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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name='Tabs' component={InsideTabLayout} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
        )}
        <Stack.Screen name='ProfileSettings' component={ProfileSettings} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  //Get color scheme and log it
  const colorScheme = useColorScheme();
  console.log('Color scheme: ', colorScheme);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthDependentLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}