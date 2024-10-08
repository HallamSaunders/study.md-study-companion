import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp } from '@react-navigation/native';

//Authentication and firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebase/firebase-config';
import { Timestamp } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}
  
interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    uid: string;
    createdAt: Timestamp;
}

export default function AuthScreen({ navigation }: RouterProps) {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    //Variables storing parameters to use
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    //const isEmailValid: boolean = (email == null) ? false : email.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
  
    const signUp = async (
        username: string,
        email: string,
        password: string,
        passwordConf: string,
        firstName: string,
        lastName: string
    ) => {
      setLoading(true);
      if (password == passwordConf
        && email !== ''
        && email.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        && username !== ''
        && firstName !== ''
        && lastName !== ''
        && password !== ''
        && passwordConf !== ''
      ) {
        try {
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            console.log(userCredential);
            const user = userCredential.user;
            
            if (user) {
                //If a user exists, write the data to it
                const userDoc: User = {
                    username,
                    email,
                    firstName,
                    lastName,
                    uid: user.uid,
                    createdAt: Timestamp.now()
                };

                try {
                    //Write the created user to the Firestore database
                    const docRef = await addDoc(collection(FIRESTORE_DB, 'users'), userDoc);
                    console.log("Document written with ID: ", docRef.id);
                } catch (error) {
                    console.error("Error adding document: ", error);
                    Alert.alert('Error', 'An error occurred while creating your account. Please try again.');
                }
            }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }

    const getEmailBorderColor = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email.match(emailRegex) || email === '' ? themeColors.border : themeColors.borderAlert;
    };

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: themeColors.text,
                marginBottom: 40
            }}>Sign Up</Text>
            <TextInput value={username} placeholder='Username' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setUsername(text)}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: themeColors.border,
                    borderBottomWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                    color: themeColors.text
                }}></TextInput>
            <View
                style={{
                    flexDirection: 'row',
                    width: '80%',
                    marginBottom: 12,
                    height: 40,
                }}>
                <TextInput value={firstName} placeholder='First Name' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setFirstName(text)}
                    style={{
                        height: '100%',
                        borderColor: themeColors.border,
                        borderBottomWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        color: themeColors.text,
                        flex: 1,
                        alignSelf: 'flex-start',
                        marginRight: 12
                    }}></TextInput>
                <TextInput value={lastName} placeholder='Last Name' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setLastName(text)}
                    style={{
                        height: '100%',
                        borderColor: themeColors.border,
                        borderBottomWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        color: themeColors.text,
                        flex: 1,
                        alignSelf: 'flex-end'
                    }}></TextInput>
            </View>
            <TextInput value={email} placeholder='Email' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setEmail(text)}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: getEmailBorderColor(email),
                    borderBottomWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: (!email.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') && !(email === '')) ? 2 : 12,
                    color: themeColors.text
                }}></TextInput>
            {(!email.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') && !(email === '')) ? (
                <Text style={{ marginBottom: 12, color: themeColors.textAlert }}>Please enter a valid email.</Text>
            ) : null }
            <TextInput value={password} placeholder='Password' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setPassword(text)} secureTextEntry={true}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: (password === passwordConf) && (password.length > 6)
                        ? themeColors.border
                        : themeColors.borderAlert,
                    borderBottomWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                    color: themeColors.text
                }}></TextInput>
            <TextInput value={passwordConf} placeholder='Confirm Password' placeholderTextColor={themeColors.subtleText} autoCapitalize='none' onChangeText={(text) => setPasswordConf(text)} secureTextEntry={true}
                style={{
                    width: '80%',
                    height: 40,
                    borderColor: (password === passwordConf) && (password.length > 6)
                        ? themeColors.border
                        : themeColors.borderAlert,
                    borderBottomWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: (!(password === passwordConf)) ? 2 : 12,
                    color: themeColors.text
                }}></TextInput>
                <View style={{
                    width: '80%',
                    marginBottom: 12,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {!(password === passwordConf) ? (
                        <Text style={{ color: themeColors.textAlert }}>Please ensure passwords match.</Text>
                    ) : null }
                    {(password.length < 8) ? (
                        <Text style={{
                            color: themeColors.textAlert,
                            textAlign: 'center',
                        }}>Please ensure password is at least 8 characters long.</Text>
                    ) : null }
                </View>
            {!loading ? (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Pressable onPress={() => signUp(username, email, password, passwordConf, firstName, lastName)}
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
    link: {
        marginTop: 15,
        paddingVertical: 15,
    }
})