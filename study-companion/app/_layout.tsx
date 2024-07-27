import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import AppIndex from './index';

//Firebase auth
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase/firebase-config';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  //Handle authorisation check
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false); //Set loading to false after checking auth state
    });
     //Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /*useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })
  }, []);*/

  //FIREBASE_AUTH.signOut();
  //console.log('User logged out.');

  if (user != null) {
    console.log('User not null, rendering inside: ', user);
    return <InsideLayout />
  } else {
    console.log('User null, rendering outside: ', user);
    return <OutsideLayout />
  }
}

/*function RootLayoutNav() {
  const colorScheme = useColorScheme();

  //Handle authorisation check
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false); //Set loading to false after checking auth state
    });

    //Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName='loginpage'>
        { user ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name='loginpage' options={{ headerShown: false }}/>
        )}
        <Stack.Screen name="profilesettings"
          options={{
            presentation: 'modal',
            headerShown: false
          }}/>
      </Stack>
    </ThemeProvider>
  );
}*/

function InsideLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profilesettings"
              options={{
                presentation: 'modal',
                headerShown: false
              }}/>
      </Stack>
    </ThemeProvider>
  );
}

function OutsideLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='loginpage' options={{ headerShown: false }}/>
      </Stack>
    </ThemeProvider>
  );
}
