import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';

//Firebase auth
import { FIREBASE_AUTH } from '../../firebase/firebase-config'
import { onAuthStateChanged, User } from 'firebase/auth';

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

const Stack = createNativeStackNavigator();

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

function UserSettings() {
  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <Pressable onPress={() => FIREBASE_AUTH.signOut()}
      style={{
          width: '80%',
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          borderColor: themeColors.borderAlert,
          borderWidth: 1,
          borderRadius: 8,
        }}>
      <Text style={{
        color: themeColors.textAlert,
        fontSize: 14
      }}>Sign Out</Text>
    </Pressable>
  )
}

function UserSettingsAnon({ navigation }: RouterProps) {
  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <Pressable onPress={() => navigation.navigate("LoginScreen")}
      style={{
          width: '80%',
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          borderColor: themeColors.borderAlert,
          borderWidth: 1,
          borderRadius: 8,
        }}>
      <Text style={{
        color: themeColors.textAlert,
        fontSize: 14
      }}>Sign Out</Text>
    </Pressable>
  )
}

export default function ProfileSettings({ navigation }: RouterProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    //Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });

    //Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      { user ? (
        <UserSettings />
      ) : (
        <UserSettingsAnon navigation={navigation} />
      )}
    </View>
  )
}