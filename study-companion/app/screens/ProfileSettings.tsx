import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';

//Firebase auth
import { FIREBASE_AUTH } from '../../firebase/firebase-config'
import { onAuthStateChanged, User } from 'firebase/auth';

//Color schemes and insets
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

function UserSettings() {
  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <Pressable onPress={() => FIREBASE_AUTH.signOut()}
        style={{
          width: '80%',
          height: 40,
          borderRadius: 8,
          paddingHorizontal: 10,
          backgroundColor: themeColors.tint,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12
          }}>
        <Text style={{
          color: themeColors.text,
          fontSize: 14
        }}>Perform Cloud Sync</Text>
      </Pressable>
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
            marginBottom: 12
          }}>
        <Text style={{
          color: themeColors.textAlert,
          fontSize: 14
        }}>Sign Out</Text>
      </Pressable>
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
        }}>Delete All User Data</Text>
      </Pressable>
    </View>
  )
}

function UserSettingsAnon({ navigation }: RouterProps) {
  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
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
        }}>Delete All User Data (irreversible)</Text>
      </Pressable>
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
    </View>
  )
}

export default function ProfileSettings({ navigation }: RouterProps) {
  //Spacing
  const insets = useSafeAreaInsets();
  
  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

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
      backgroundColor: themeColors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      height: "100%",
      width: "100%",
    }}>
      { user ? (
        <UserSettings />
      ) : (
        <UserSettingsAnon navigation={navigation} />
      )}
    </View>
  )
}