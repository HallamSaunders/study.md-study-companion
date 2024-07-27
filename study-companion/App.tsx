import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

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
import { ThemeProvider, useTheme } from './contexts/ColorThemeContext';
import Colors from './constants/Colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  console.log('Color scheme: ', colorScheme)

  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Metrics" component={MetricsScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        headerRight: () => (
          <Link href='./app/screens/ProfileSettings' asChild>
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
};

const AppNavigator = () => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  console.log('Color scheme: ', colorScheme)

  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }}/>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  </AuthProvider>
);

export default App;