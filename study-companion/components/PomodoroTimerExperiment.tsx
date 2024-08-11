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
    //const [pomodoroStartingInterval, setPomodoroStartingInterval] = useState(1500);
    const [pomodoroStartingInterval, setPomodoroStartingInterval] = useState(5);
    const [pomodoroInterval, setPomodoroInterval] = useState(1500);
    const [breakStartingInterval, setBreakStartingInterval] = useState(300);
    const [breakInterval, setBreakInterval] = useState(300);

    const [timer, setTimer] = useState(0);

    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [stopped, setStopped] = useState(true);

    const [working, setWorking] = useState(true);
    const [editBreak, setEditBreak] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    const clearTimer = () => {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
    };

    const startPomodoro = () => {
        //setPaused(false);
        //setStopped(false);
        //Use setState callback to ensure we're working with updated state
        setRunning(prevRunning => {
            setPaused(prevPaused => {
                setStopped(prevStopped => {

                    console.log("---START---");
                    console.log("Running: ", prevRunning);
                    console.log("Paused: ", prevPaused);
                    console.log("Stopped: ", prevStopped);
                    console.log("Working: ", working);

                    if (working) {
                        if (prevPaused || prevStopped) {
                            if (prevStopped) {
                                setPomodoroInterval(pomodoroStartingInterval);
                                startTimer();
                            } 
                        }
                    } else {
                        if (prevPaused || prevStopped) {
                            if (prevStopped) {
                                setBreakInterval(breakStartingInterval);
                                startTimer();
                            } 
                        }
                    }
                    return false; //New value for stopped
                });
                return false; //New value for paused
            });
            return true; //New value for running
        });
    };

    const startTimer = () => {
        if (working) {
            if (pomodoroInterval === 0) {
                handleSwitchToBreak();
            } else {
                timerRef.current = setInterval(() => {
                    setPomodoroInterval(prevTime => {
                        if (prevTime === 0) {
                            clearTimer();
                            handleSwitchToBreak();
                            return prevTime;
                        }
                        console.log("Pomodoro timer: ", prevTime);
                        return prevTime - 1;
                    });
                }, 1000);
            }
        } else {
            if (breakInterval === 0) {
                handleSwitchToStudy();
            } else {
                timerRef.current = setInterval(() => {
                    setBreakInterval(prevTime => {
                        if (prevTime === 0) {
                            clearTimer();
                            handleSwitchToStudy();
                            return prevTime;
                        }
                        console.log("Break timer: ", prevTime);
                        return prevTime - 1;
                    });
                }, 1000);
            }
        }
    };

    //Change to break time when study time is over
    const handleSwitchToBreak = () => {
        clearTimer();
        setBreakInterval(breakStartingInterval);
        setRunning(true);
        setWorking(false);
        startTimer();
    };
      
    const handleSwitchToStudy = () => {
        clearTimer();
        setPomodoroInterval(pomodoroStartingInterval);
        setRunning(true);
        setWorking(true);
        startTimer();
    };

    const pausePomodoro = () => {
        clearTimer();
        setRunning(false);
        setPaused(true);
        setStopped(false);
    };

    const resetPomodoro = () => {
        clearTimer();
        setRunning(false);
        setPaused(false);
        setStopped(true);
        setPomodoroInterval(pomodoroStartingInterval);
        setBreakInterval(breakStartingInterval);
    };

    //Handle incremenet/decrementing values
    const handleIncrement = () => {
        if (stopped) {
            if (editBreak) {
                setBreakStartingInterval(prevInterval => {
                    return prevInterval + 60;
                })
            } else {
                setPomodoroStartingInterval(prevInterval => {
                    return prevInterval + 300;
                })
            }
        }
        console.log("Interval: ", breakStartingInterval);
    }

    const handleDecrement = () => {
        if (stopped) {
            if (editBreak) {
                setBreakStartingInterval(prevInterval => {
                    if (prevInterval === 0) {
                        return 0;
                    }
                    return prevInterval - 60;
                })
            } else {
                setBreakStartingInterval(prevInterval => {
                    if (prevInterval === 0) {
                        return 0;
                    }
                    return prevInterval - 300;
                })
            }
        }
    }

    const handleDefaultReset= () => {
        if (stopped) {
            if (editBreak) {
                setBreakStartingInterval(300);
            } else {
                setPomodoroStartingInterval(1500);
            }
        }
    }

    useEffect(() => {
        if (running && !paused && !stopped) {
            startTimer();
        } else {
            clearTimer();
        }
    
        return clearTimer; //Cleanup function
    }, [running, paused, stopped, working]);
  
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

    return (
        <View onLayout={handleLayout} style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            //borderColor: themeColors.border,
            //borderWidth: 1,
            //borderRadius: 8,
            }}>

            {/* RENDER TIMER NAME DEPENDING ON STATE */}
            { running || paused ? (
                <View>
                    { working ? (
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
                    <Pressable onPress={() => setEditBreak(false)}
                        style={{
                            marginRight: 5,
                            backgroundColor: (editBreak ? themeColors.background : themeColors.backgroundSelected),
                            padding: 5,
                            borderRadius: 8
                            }}>
                        <Text>Study</Text>
                    </Pressable>
                    <Pressable onPress={() => setEditBreak(true)}
                        style={{
                            marginRight: 5,
                            backgroundColor: (editBreak ? themeColors.backgroundSelected : themeColors.background),
                            padding: 5,
                            borderRadius: 8
                            }}>
                        <Text>Break</Text>
                    </Pressable> 
                </View>
            ) : (
                <View></View>
            )}

            {/* RENDER TIMER AND PROGRESS BAR DEPENDING ON RUNNING OR NOT */}
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
                    { editBreak ? (
                        <Text style={{
                            fontSize: 60,
                            color: themeColors.text
                        }}>{formatTime(breakStartingInterval)}</Text>
                    ) : (
                        <Text style={{
                            fontSize: 60,
                            color: themeColors.text
                        }}>{formatTime(pomodoroStartingInterval)}</Text>
                    )}
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

            {/* RENDER INCREMENT NUMBERS DEPENDING ON BREAK OR NOT */}
            { editBreak ? (
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
                        }}>Increment 1 min</Text>
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
            ) : (
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
            )}

            {/* RENDER RESET NUMBERS DEPENDING ON BREAK OR NOT */}
            { editBreak ? (
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
                    }}>Reset to 5 mins</Text>
                </Pressable>
            </View>
            ) : (
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
            )}

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