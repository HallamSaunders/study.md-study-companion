import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

//Color schemes and insets
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Timers and components
import PomodoroTimer from '../../components/PomodoroTimer';
import RegularTimer from '../../components/RegularTimer';

export default function Pomodoro() {
  const [pomodoro, setPomodoro] = useState(true);

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
        <Pressable onPress={() => setPomodoro(true)}
          style={{
            marginRight: 5,
            backgroundColor: (pomodoro ? themeColors.backgroundSelected : themeColors.background),
            padding: 5,
            borderRadius: 8
        }}>
          <Text style={{
              fontSize: 14,
              color: themeColors.text
          }}>Pomodoro</Text>
        </Pressable>
        <Pressable onPress={() => setPomodoro(false)}
          style={{
            backgroundColor: (pomodoro ? themeColors.background : themeColors.backgroundSelected),
            padding: 5,
            borderRadius: 8
        }}>
          <Text style={{
              fontSize: 14,
              color: themeColors.text
          }}>Stopwatch</Text>
        </Pressable>
      </View>
      <View style={{
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          width: '75%',
          alignItems: 'center',
          //borderWidth: 2,
          //borderColor: 'red'
        }}>
          { pomodoro ? (
            <PomodoroTimer />
          ) : (
            <RegularTimer />
          )}
        </View>
      </View>
    </View>
  )
}
