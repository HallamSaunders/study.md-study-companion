import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

//Color schemes
import { useColorScheme } from './useColorScheme';
import Colors from '../constants/Colors';

const StopwatchTimer = () => {
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
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };
  
    //Get width for borders
    const [containerWidth, setContainerWidth] = useState(0);
    const [percentFilled, setPercentageFilled] = useState(0);
  
    const calculatePercentageFilled = () => {
        const percentFilled = ((stopwatchTime % 60) / 60);
        setPercentageFilled(percentFilled);
    };
  
    const getWidthInPixels = () => {
        return (percentFilled) * containerWidth;
    };
  
    const getAntiWidthInPixels = () => {
        return (1-percentFilled) * containerWidth;
    };
  
    const handleLayout = (event: { nativeEvent: { layout: { width: any; }; }; }) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };
  
    useEffect(() => {
        calculatePercentageFilled();
    }, [stopwatchTime]);
  
    return (
        <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 'auto',
                marginTop: 40
        }}>
            <View onLayout={handleLayout} style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginBottom: 40
            }}>
                <Text style={{
                    fontSize: 60,
                    color: themeColors.text
                }}>{formatTime(stopwatchTime)}</Text>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        borderBottomColor: themeColors.tint,
                        borderBottomWidth: 3,
                        width: getWidthInPixels()
                    }}></View>
                    <View style={{
                        borderBottomColor: themeColors.subtleText,
                        borderBottomWidth: 3,
                        width: getAntiWidthInPixels()
                    }}></View>
                </View>
            </View>
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
                }}>Pause</Text>   
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
    )
}

export default StopwatchTimer