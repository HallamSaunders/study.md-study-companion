import { StyleSheet, TextInput, useColorScheme } from 'react-native';
import { useState } from 'react';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

//Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase/firebase-config';

export default function Notes() {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    //Variables storing parameters to use
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
                fontSize: 20,
                fontWeight: 'bold',
                color: themeColors.text
            }}>Login</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <TextInput value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}
                style={{
                    width: '100%',
                    height: 40,
                    borderColor: '#eee',
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                }}></TextInput>
            <TextInput value={password} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)} secureTextEntry={true}
                style={{
                    width: '100%',
                    height: 40,
                    borderColor: '#eee',
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 12,
                }}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }
});
