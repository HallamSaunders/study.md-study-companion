import React, { useEffect, useState } from 'react';
import { NavigationContainer, ThemeProvider, DarkTheme, DefaultTheme, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, View } from 'react-native';


import { Feather } from '@expo/vector-icons';

//Auth
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase/firebase-config';
import { getUsernameByUID } from './components/getUsername';

//Screens
import LoginScreen from './app/auth/LoginScreen';
import CalendarScreen from './app/(tabs)/Calendar';
import MetricsScreen from './app/(tabs)/Metrics';
import NotesScreen from './app/(tabs)/Notes';
import ProfileScreen from './app/(tabs)/Profile';
import TimerScreen from './app/(tabs)/Pomodoro';
import ProfileSettings from './app/screens/ProfileSettings';
import AuthScreen from './app/auth/AuthScreen';

//Color schemes
import { useColorScheme } from './components/useColorScheme';
import Colors from './constants/Colors';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.notification,
  },
};

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.notification,
  },
};

//Stacks and tabs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

function InsideTabLayout({ navigation }: RouterProps) {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const iconSize: number = 28;

  const currentUsername = async (): Promise<string> => {
    const currentUser = FIREBASE_AUTH.currentUser;
    let username: string = 'Profile';
  
    if (currentUser) {
      username = await getUsernameByUID(currentUser.uid) || 'Profile';
    }
  
    //console.log('Username:', username);
    return username;
  };

  const [title, setTitle] = useState<string>('Profile');

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await currentUsername();
      setTitle(username);
    };

    fetchUsername();
  }, []);

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
            name='bar-chart'
            color={focused ? themeColors.tabIconSelected : themeColors.tabIconDefault}
            size={iconSize}  
          />
        }
      }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ 
        title: title,
        headerShown: true,
        tabBarIcon: ({ focused }) => {
          return <Feather
            name="user"
            color={focused ? themeColors.tabIconSelected : themeColors.tabIconDefault}
            size={iconSize}  
          />
        },
        headerRight: () => {
          return <Pressable onPress={() => navigation.navigate('ProfileSettings')}>
            <Feather 
              name='settings'
              color={themeColors.tabIconDefault}
              size={iconSize}
              style={{
                marginRight: 12
              }}
            />
          </Pressable>
        }
      }}/>
    </Tab.Navigator>
  );
}

function AuthDependentLayout() {
  const colorScheme = useColorScheme();
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      //console.log('Auth state changed: ', user);
      setUser(user);
    })
  }, []);

  //Safe area insets hook
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <View style={{
          flex: 1,
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}>
          {user ? (
            <Stack.Navigator>
              <Stack.Screen name='Tabs' component={InsideTabLayout} options={{ headerShown: false }} />
              <Stack.Screen name='ProfileSettings' component={ProfileSettings} options={{ headerShown: false }}/>
            </Stack.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
              <Stack.Screen name='AuthScreen' component={AuthScreen} options={{ headerShown: false }}/>
            </Stack.Navigator>
          )}
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  //Get color scheme and log it
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  //const colorScheme = 'dark';
  console.log('Color scheme: ', colorScheme);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <StatusBar backgroundColor={themeColors.background}/>
      <SafeAreaProvider>
        <AuthDependentLayout />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}