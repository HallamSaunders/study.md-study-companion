import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput, useColorScheme } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

//Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase-config';

export default function ModalScreen() {
    //Color schemes
    const colorScheme = useColorScheme();
    console.log(colorScheme);
    const themeInputStyle = colorScheme === 'light' ? styles.lighttextinput : styles.darktextinput;
    const themeInputContainerStyle = colorScheme === 'light' ? styles.lightinputcontainer : styles.darkinputcontainer;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={[themeInputContainerStyle]}>
        <TextInput value={email} placeholder='Email' autoCapitalize='none'
            onChangeText={(text) => setEmail(text)}
            style={[themeInputStyle]}></TextInput>
        <TextInput value={password} placeholder='Password' autoCapitalize='none'
            onChangeText={(text) => setPassword(text)} secureTextEntry={true} style={[themeInputStyle]}></TextInput>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  lighttextinput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  lightinputcontainer: {
    width: '100%',
    paddingRight: '10%',
    paddingLeft: '10%',
    alignItems: 'center',
  },
  darktextinput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,

  },
  darkinputcontainer: {
    width: '100%',
    paddingRight: '10%',
    paddingLeft: '10%',
    alignItems: 'center',
  }
});
