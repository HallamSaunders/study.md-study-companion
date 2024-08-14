import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

//Color schemes and insets
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Components
import MetricsBarChart from '../../components/MetricsBarChart';

export default function Metrics() {
  //Spacing
  const insets = useSafeAreaInsets();

  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={{
      backgroundColor: themeColors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      height: "100%",
      width: "100%",
      }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        }}>

      </View>
      <View style={{
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          width: '80%',
          alignItems: 'center',
          //borderColor: 'red',
          //borderWidth: 2
        }}>
          <MetricsBarChart />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})