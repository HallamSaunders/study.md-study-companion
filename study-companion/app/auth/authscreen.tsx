import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp } from '@react-navigation/native';

//Authentication
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase/firebase-config';

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}
  

export default function AuthScreen({ navigation }: RouterProps) {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    //Variables storing parameters to use
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [loading, setLoading] = useState(false);
  
    const signUp = async () => {
      setLoading(true);
      if (password == passwordConf) {
        try {
          const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
          console.log(response);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        alert('Passwords do not match!');
      }
    }

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: themeColors.text,
                marginBottom: 40
            }}>Sign Up</Text>
            <TextInput value={email} placeholder='Email' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setEmail(text)}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: themeColors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                    color: themeColors.text
                }}></TextInput>
            <TextInput value={password} placeholder='Password' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setPassword(text)} secureTextEntry={true}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: themeColors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                    color: themeColors.text
                }}></TextInput>
            <TextInput value={passwordConf} placeholder='Confirm Password' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setPasswordConf(text)} secureTextEntry={true}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: themeColors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                    color: themeColors.text
                }}></TextInput>
            <Pressable onPress={signUp}
                style={{
                    width: '40%',
                    height: 40,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    backgroundColor: themeColors.tint,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: themeColors.text,
                    }}>Sign Up</Text>        
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Login')} style={styles.link}>
                <Text style={{
                    fontSize: 14,
                    color: themeColors.text,
                    marginBottom: 40
                }}>Already have an account? Click here to log in!</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    }
})