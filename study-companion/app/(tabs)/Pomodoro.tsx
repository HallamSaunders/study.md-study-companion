import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'

//Color schemes
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Pomodoro() {
  const [pomodoro, setPomodoro] = useState(true);

  //Spacing
  const insets = useSafeAreaInsets();

  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  //Timers
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startStopwatch = () => {
    if (!running) {
      setRunning(true);
      timerRef.current = setInterval(() => {
        setStopwatchTime(prevTime => prevTime + 1);
      }, 1000);
    }
  };

  const stopStopwatch = () => {
    if (running && timerRef.current) {
      setRunning(false);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetStopwatch = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRunning(false);
    setStopwatchTime(0);
  };

  const formatTime = (time: number) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = Math.floor(time / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    return (getHours == "00") ? `${getMinutes}:${getSeconds}` : `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <View style={{
      backgroundColor: themeColors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,

    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
        <Pressable onPress={() => setPomodoro(true)}
          style={{
            marginRight: 5,
            backgroundColor: (pomodoro ? themeColors.backgroundSelected : themeColors.background),
            padding: 5,
            borderRadius: 8
        }}>
          <Text>Pomodoro</Text>
        </Pressable>
        <Pressable onPress={() => setPomodoro(false)}
          style={{
            backgroundColor: (pomodoro ? themeColors.background : themeColors.backgroundSelected),
            padding: 5,
            borderRadius: 8
        }}>
          <Text>Stopwatch</Text>
        </Pressable>
      </View>
      { pomodoro ? (
        <View>
          <Text>pomodoro</Text>
        </View>
      ) : (
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: 40
        }}>
          <Text style={{
            marginBottom: 40
          }}>{formatTime(stopwatchTime)}</Text>
          <Pressable onPress={() => startStopwatch()}
            style={{
              width: '40%',
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
            }}>Start</Text>     
          </Pressable>
          <Pressable onPress={() => stopStopwatch()}
            style={{
              width: '40%',
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
            }}>Stop</Text>   
          </Pressable>
          <Pressable onPress={() => resetStopwatch()}
            style={{
              width: '40%',
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
            }}>Reset</Text>   
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({})