import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Markdown from 'react-native-markdown-display'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

const Drawer = createDrawerNavigator();

export default function Notes() {
  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  //Safe area insets hook
  const insets = useSafeAreaInsets();

  //Handle markdown rendering for selected file
  const [content, setContent] = useState('');

  return (
    <ScrollView>
      <Markdown>{content}</Markdown>
    </ScrollView>
  )
}