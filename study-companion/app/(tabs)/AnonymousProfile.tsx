import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const AnonymousProfile = ({ navigation }: RouterProps) => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
    //Safe area insets hook
    const insets = useSafeAreaInsets();

    return (
    <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',

        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    }}>
        <Text style={{
            color: themeColors.text,
            fontSize: 14,
            marginBottom: 12,
            width: '80%',
            textAlign: 'center'
        }}>Want more from the app? Create an account to access calendars, Pomodoro timers, study metrics, and more!</Text>
        <Pressable onPress={() => navigation.navigate("LoginScreen")}
            style={{
                width: '80%',
                height: 40,
                borderRadius: 8,
                paddingHorizontal: 10,
                backgroundColor: themeColors.tint,
                justifyContent: 'center',
                alignItems: 'center',
                }}>
            <Text style={{
                color: themeColors.text,
                fontSize: 14
            }}>Log In or Create Account</Text>
        </Pressable>
    </View>
  )
}

export default AnonymousProfile