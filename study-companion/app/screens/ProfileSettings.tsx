import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Firebase auth
import { FIREBASE_AUTH } from '../../firebase/firebase-config'

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

const Stack = createNativeStackNavigator();

export default function ProfileSettings() {
  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <View style={styles.container}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
  },
  containerBottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
},
  link: {
      marginTop: 15,
      paddingVertical: 15,
  }
})