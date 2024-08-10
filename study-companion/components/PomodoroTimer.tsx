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
    const [pomodoroInterval, setPomodoroInterval] = useState(1500);
    const [breakInterval, setBreakInterval] = useState(300);
    const [timer, setTimer] = useState(1500);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [stopped, setStopped] = useState(true);
    const [studying, setStudying] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    //Handle change to breaking and studying
    useEffect(() => {
        if (studying) {
            setTimer(pomodoroInterval);
        } else {
            setTimer(breakInterval);
        }
    }, [studying])

    //Handle states when running/paused/stopped
    useEffect(() => {
        if (running && !paused) {
            timerRef.current = setInterval(() => {
                setTimer((prevInterval) => {
                    if (prevInterval > 0) {
                        return prevInterval - 1;
                    } else {
                        //Handle clearing interval if it hits 0
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                        }
                        setStudying((prevStudying) => !prevStudying);
                        return 0;
                    }
                });
            }, 1000);
        }
        if (stopped) {
            if (studying) {
                setPomodoroInterval(1500);
            } else {
                setBreakInterval(300);
            }
        }

        //Cleanup interval on unmount or when running/working/paused changes
        return () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null; //Reset after clearing
            }
        };
    }, [running, paused, stopped, studying])

    //Update intervals when they change
    useEffect(() => {
        console.log("Pomodoro updated to: ", pomodoroInterval);
        console.log("Break updated to: ", breakInterval);

        //Update timer to match intervals
        if (stopped) {
            if (studying) {
                setTimer(pomodoroInterval);
            } else {
                setTimer(breakInterval);
            }
        }
    }, [pomodoroInterval, breakInterval])

    //Update timer when it changes
    useEffect(() => {
        console.log("Timer updated to: ", timer);
    }, [timer])

    const startPomodoro = () => {
        if (stopped || paused) {
            setRunning(true);
            setPaused(false);
            setStopped(false);
            if (stopped) {
                if (studying) {
                    setTimer(pomodoroInterval);
                } else {
                    setTimer(breakInterval);
                }
            }
        }
    };

    const pausePomodoro = () => {
        if (running) {
            setRunning(false);
            setPaused(true);
            setStopped(false);
        }
    };
    
    const resetPomodoro = () => {
        if (paused) {
            setRunning(false);
            setPaused(false);
            setStopped(true);
            if (studying) {
                setTimer(pomodoroInterval);
            } else {
                setTimer(breakInterval);
            }
        }
    };

    const handleIncrement = () => {
        if (studying) {
            setPomodoroInterval(pomodoroInterval + 300);
        } else {
            setBreakInterval(breakInterval + 60);
        }
    }

    const handleDecrement = () => {
        if (studying) {
            if (pomodoroInterval >= 600) setPomodoroInterval(pomodoroInterval - 300);
        } else {
            if (breakInterval >= 120) setBreakInterval(breakInterval - 60);
        }
    }

    const handleDefaultReset = () => {
        if (studying) {
            setPomodoroInterval(1500);
        } else {
            setBreakInterval(300);
        }
    }

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
        if (pomodoroInterval > 0 && breakInterval > 0) {
            const percentFilled = (studying) ? (timer / pomodoroInterval) : (timer / breakInterval);
            setPercentageFilled(percentFilled);
        }
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
    }, [timer]);

    return (
        <View onLayout={handleLayout} style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            }}>

            {/* RENDER TIMER NAME DEPENDING ON STATE */}
            { running || paused ? (
                <View>
                    { studying ? (
                        <Text style={{
                            fontSize: 48
                        }}>Study</Text>
                    ) : (
                        <Text style={{
                            fontSize: 48
                        }}>Break</Text>
                    )}
                </View>
            ) : (
                <View></View>
            )}

            {/* RENDER STUDY/BREAK TOGGLE */}
            { stopped ? (
                <View style={{
                    flexDirection: 'row'
                    }}>
                    <Pressable onPress={() => setStudying(true)}
                        style={{
                            marginRight: 5,
                            backgroundColor: (studying ? themeColors.backgroundSelected : themeColors.background),
                            padding: 5,
                            borderRadius: 8
                            }}>
                        <Text>Study</Text>
                    </Pressable>
                    <Pressable onPress={() => setStudying(false)}
                        style={{
                            marginRight: 5,
                            backgroundColor: (studying ? themeColors.background : themeColors.backgroundSelected),
                            padding: 5,
                            borderRadius: 8
                            }}>
                        <Text>Break</Text>
                    </Pressable> 
                </View>
            ) : (
                <View></View>
            )}

            {/* RENDER TIMER AND PROGRESS BAR */}
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 60,
                        color: themeColors.text,
                        }}>{formatTime(timer)}</Text>
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

            {/* RENDER INCREMENT NUMBERS DEPENDING ON BREAK OR NOT */}
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
                { studying ? (
                    <Text style={{
                        fontSize: 14,
                        color: stopped ? themeColors.text : themeColors.tabIconDefault,
                    }}>Increment 5 mins</Text>
                ) : (
                    <Text style={{
                        fontSize: 14,
                        color: stopped ? themeColors.text : themeColors.tabIconDefault,
                    }}>Increment 1 min</Text>
                )}
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

            {/* RENDER RESET NUMBERS DEPENDING ON BREAK OR NOT */}
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
                    { studying ? (
                        <Text style={{
                            fontSize: 14,
                            color: stopped ? themeColors.text : themeColors.tabIconDefault,
                        }}>Reset to 25 mins</Text>
                    ) : (
                        <Text style={{
                            fontSize: 14,
                            color: stopped ? themeColors.text : themeColors.tabIconDefault,
                        }}>Reset to 5 mins</Text>
                    )}
                </Pressable>
            </View>

            {/* RENDER BUTTONS DEPENDING ON STATE OF TIMERS */}
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