import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

//Color schemes
import { useColorScheme } from './useColorScheme';
import Colors from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

const PomodoroTimer = () => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    //Timers
    const [pomodoroStartingInterval, setPomodoroStartingInterval] = useState(1500);
    const [pomodoroInterval, setPomodoroInterval] = useState(1500);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [stopped, setStopped] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    const startPomodoro = () => {
        if (paused) {
            timerRef.current = setInterval(() => {
                setPomodoroInterval(prevTime => prevTime - 1);
            }, 1000);
        }
        if (stopped) {
            setPomodoroInterval(pomodoroStartingInterval);
            timerRef.current = setInterval(() => {
                setPomodoroInterval(prevTime => prevTime - 1);
            }, 1000);
        }
        setRunning(true);
        setPaused(false);
        setStopped(false);
    };
  
    const pausePomodoro = () => {
        if (running && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setRunning(false);
        setPaused(true);
        setStopped(false);
    };
  
    const resetPomodoro = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setRunning(false);
        setPaused(false);
        setStopped(true);
        setPomodoroInterval(pomodoroStartingInterval);
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
        const percentFilled = (pomodoroInterval / pomodoroStartingInterval);
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
    }, [pomodoroInterval]);
  
    //Handle incremenet/decrementing values
    const handleIncrement = () => {
        if (stopped) setPomodoroStartingInterval(pomodoroStartingInterval + 300);
    }

    const handleDecrement = () => {
        if (pomodoroStartingInterval > 0 && stopped) setPomodoroStartingInterval(pomodoroStartingInterval - 300);
    }

    const handleDefaultReset= () => {
        if (stopped) setPomodoroStartingInterval(1500);
    }

    return (
        <View onLayout={handleLayout} style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            { running || paused ? (
                <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 60,
                            color: themeColors.text,

                        }}>{formatTime(pomodoroInterval)}</Text>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <View style={{
                                borderBottomColor: themeColors.tint,
                                borderBottomWidth: 3,
                                width: getWidthInPixels(),
                                maxWidth: '100%'
                            }}></View>
                            <View style={{
                                borderBottomColor: themeColors.subtleText,
                                borderBottomWidth: 3,
                                width: getAntiWidthInPixels(),
                                maxWidth: '100%'
                            }}></View>
                        </View>
                </View>
            ) : (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 60,
                        color: themeColors.text
                    }}>{formatTime(pomodoroStartingInterval)}</Text>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            borderBottomColor: themeColors.tint,
                            borderBottomWidth: 3,
                            width: containerWidth
                        }}></View>
                    </View>
                </View>
            )}
            <View
                style={{
                    marginTop: 12,
                    height: 30,
                    backgroundColor: themeColors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>
                    <Pressable onPress={() => handleDecrement()}
                        style={{
                            marginRight: 5,
                            backgroundColor: themeColors.background,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Feather name='arrow-down-circle'
                            color={stopped ? themeColors.text : themeColors.tabIconDefault}
                            size={24}/>
                    </Pressable>
                    <Text style={{
                            fontSize: 14,
                            color: stopped ? themeColors.text : themeColors.tabIconDefault,
                        }}>Increment 5 mins</Text>
                    <Pressable onPress={() => handleIncrement()}
                        style={{
                            marginLeft: 5,
                            backgroundColor: themeColors.background,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Feather name='arrow-up-circle'
                            color={stopped ? themeColors.text : themeColors.tabIconDefault}
                            size={24}/>
                    </Pressable>
            </View>
            <View
                style={{
                    height: 30,
                    backgroundColor: themeColors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Pressable onPress={() => handleDefaultReset()}
                        style={{
                            marginTop: 12,
                            height: 20,
                            backgroundColor: themeColors.background,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{
                            fontSize: 14,
                            color: stopped ? themeColors.text : themeColors.tabIconDefault,
                        }}>Reset to 25 mins</Text>
                    </Pressable>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 20
            }}>
                { stopped || paused ? (
                    <Pressable onPress={() => startPomodoro()}
                        style={{
                            flex: 1,
                            height: 40,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            backgroundColor: themeColors.tint,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: paused ? 12 : 0
                        }}>
                        <Text style={{
                            fontSize: 14,
                            color: themeColors.text,
                        }}>Start</Text>
                    </Pressable>
                ) : (
                    <View></View>
                )}
                { paused ? (
                    <Pressable onPress={() => resetPomodoro()}
                        style={{
                            flex: 1,
                            height: 40,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            backgroundColor: themeColors.tint,
                            justifyContent: 'center',
                            alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: themeColors.text,
                        }}>Reset</Text>   
                    </Pressable>
                ) : (
                    <View></View>
                )}
                { running ? (
                    <Pressable onPress={() => pausePomodoro()}
                        style={{
                            flex: 1,
                            width: '100%',
                            height: 40,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            backgroundColor: themeColors.tint,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{
                            fontSize: 14,
                            color: themeColors.text,
                        }}>Pause</Text> 
                    </Pressable>
                ) : (
                    <View></View>
                )}
            </View>
        </View>
    )
}

export default PomodoroTimer