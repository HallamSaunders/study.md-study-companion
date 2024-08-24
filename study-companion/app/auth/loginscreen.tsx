import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp } from '@react-navigation/native';

//Authentication
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase/firebase-config';

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { Line } from 'react-native-svg';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}
  

export default function LoginScreen({ navigation }: RouterProps) {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    //Variables storing parameters to use
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: themeColors.text,
                marginBottom: 40
            }}>Login</Text>
            <TextInput value={email} placeholder='Email' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setEmail(text)}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: (email === '') ? themeColors.borderAlert : themeColors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: (!email.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') && !(email === '')) ? 2 : 12,
                    color: themeColors.text
                }}></TextInput>
            {(!email.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') && !(email === '')) ? (
                <Text style={{ marginBottom: 12, color: themeColors.textAlert }}>Please enter a valid email.</Text>
            ) : (
                <View></View>
            )}
            <TextInput value={password} placeholder='Password' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setPassword(text)} secureTextEntry={true}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: (password === '') ? themeColors.borderAlert : themeColors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                    color: themeColors.text
                }}></TextInput>
            {!loading ? (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '80%' }}>
                    <Pressable onPress={signIn}
                        style={{
                            width: '50%',
                            height: 40,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            backgroundColor: themeColors.tint,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 12
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: themeColors.text,
                            }}>Log in</Text>        
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('AuthScreen')} style={{
                        marginTop: 40,
                        marginBottom: 12
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: themeColors.text,
                        }}>Don't have an account yet? Click here to sign up!</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Tabs")}>
                        <Text style={{
                            fontSize: 14,
                            color: themeColors.text,
                            textAlign: 'center',
                        }}>Just want to make notes? Click here to continue without an account.</Text>
                    </Pressable>
                </View>
            ) : (
                <ActivityIndicator size='large' color={themeColors.tint}/>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

})