import { View, Text } from 'react-native'
import React from 'react'

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

const Timeline = () => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
    return (
        <View>
            <Text style={{
                fontSize: 14,
                color: themeColors.text,
            }}>Timeline</Text>
        </View>
    )
}

export default Timeline