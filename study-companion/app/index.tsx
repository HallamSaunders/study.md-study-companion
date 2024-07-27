import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';

//Firebase auth
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase/firebase-config';

export default function AppIndex() {
    const colorScheme = useColorScheme();
  
    //Handle authorisation check
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        setUser(user);
        console.log('Auth State Changed: ', user);
        setLoading(false); //Set loading to false after checking auth state
      });
  
      //Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

    if (loading) {
        // You can render a loading screen here if desired
        return (
           <Text>Loading...</Text>
        );
    }
  
    return (
        /*<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
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
        </ThemeProvider>*/
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            { user ? (
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
                </Stack>
            ) : (
                <Stack>
                    <Stack.Screen name='loginpage' options={{ headerShown: false }}/>
                </Stack>
            )}
        </ThemeProvider>
    );
  }