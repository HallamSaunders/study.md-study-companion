import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

//Color schemes
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';

export default function Profile() {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return (
    <View style={{
      backgroundColor: themeColors.background
    }}>
      <View >

      </View>

    </View>
  )
}

const styles = StyleSheet.create({})