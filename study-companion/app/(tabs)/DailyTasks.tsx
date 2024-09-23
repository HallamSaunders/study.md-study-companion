import { View, Text } from 'react-native'
import React, { useState } from 'react'

//Color schemes, icons and insets
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function DailyTasks() {
    //Spacing
    const insets = useSafeAreaInsets();

    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    //Daily lists logic
    const [completed, setCompleted] = useState([]);
    const [unccompleted, setUncompleted] = useState([]);

    return (
    <View style={{
        backgroundColor: themeColors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        height: "100%",
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
    }}>
        <View style={{
            borderColor: themeColors.border,
            borderWidth: 1,
            borderRadius: 8,
            width: "80%",
            padding: 12,
        }}>
            <Text style={{
                color: themeColors.text,
                fontSize: 20,
                textAlign: 'left',
                marginBottom: 12,
            }}>Daily Tasks</Text>
            <View>
                <Text style={{
                    color: themeColors.text,
                    fontSize: 16,
                    textAlign: 'left',
                }}>Uncompleted</Text>
                <Feather name='plus'/>
                {unccompleted.map((task, index) => {
                    return (
                        
                        <Text key={index} style={{
                            color: themeColors.text,
                            fontSize: 16,
                            textAlign: 'left',
                        }}>{task}</Text>
                    )
                })}
            </View>

            <Text style={{
                color: themeColors.text,
                fontSize: 16,
                textAlign: 'left',
            }}>Completed</Text>
      </View>
    </View>
  )
}