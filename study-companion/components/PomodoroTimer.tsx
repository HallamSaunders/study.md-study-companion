import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

//Color schemes
import { useColorScheme } from './useColorScheme';
import Colors from '../constants/Colors';

import { Feather } from '@expo/vector-icons';

//Firestore and SQLite imports
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebase/firebase-config';
import { getUserDocID } from '../firebase/databaseCalls';
import { sqliteManager } from '../sqlite/sqlite-config';

interface sessionData {
    time: number,
    blocks: number,
    timestamp: Timestamp,
    type: string
}

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

    //Metrics for session
    const [totalTime, setTotalTime] = useState(0);
    const [completedBlocks, setCompletedBlocks] = useState(0);

    const [loading, setLoading] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    //Handle change to breaking and studying
    useEffect(() => {
        if (studying) {
            setTimer(pomodoroInterval);
        } else {
            setTimer(breakInterval);
        }
    }, [studying, pomodoroInterval, breakInterval])

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
                        //Update study blocks completed
                        if (studying) {
                            setCompletedBlocks((prevInterval) => {
                                return prevInterval + 1;
                            })
                        }
                        //Update studying status to reflect study -> break or vice versa
                        setStudying((prevStudying) => !prevStudying);
                        return 0;
                    }
                });

                //Only add time to total session time if not on break
                if (studying) {
                    setTotalTime((prevInterval) => {
                        return prevInterval + 1;
                    });
                }
            }, 1000);
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
        //Update timer to match intervals
        if (stopped) {
            if (studying) {
                setTimer(pomodoroInterval);
            } else {
                setTimer(breakInterval);
            }
        }
    }, [pomodoroInterval, breakInterval])

    //Handle logic for saving stats to database
    const logSessionStats = async (totalTime: number, totalBlocks: number) => {
        if (!(totalTime === 0)) {
            
            setLoading(true);

            //Write data to user/{uid}/sessions FIREBASE
            /*try {
                const sessionData: sessionData = {
                    time: totalTime,
                    blocks: totalBlocks,
                    timestamp: Timestamp.now(),
                    type: 'pomodoro'
                };

                console.log(FIREBASE_AUTH.currentUser);

                //Add document with userDoc reference
                const userDocId = await getUserDocID();
                const docRef = await addDoc(collection(FIRESTORE_DB, `users/${userDocId}/sessions`), sessionData);

                console.log("Doc: ", docRef);

                //Reset total time
                setCompletedBlocks(0);
                setTotalTime(0);
                setLoading(false);
            } catch (error) {
                console.error("Error writing session data: ", error);
            }*/

            //Write data to SQLite database
            try {
                await sqliteManager.insertSession(totalTime, totalBlocks, new Date().toISOString(), 'pomodoro');

                //Reset total time
                setCompletedBlocks(0);
                setTotalTime(0);
                setLoading(false);
            } catch (error) {
                console.error("Error writing session data: ", error);     
            }
        }
    }

    //Custom alert called by reset button
    const showAlert = () => {
        Alert.alert(
            'Are you sure you want to reset the timer?',
            'Your total session time will reset unless you finish the current Pomodoro block.',
            [
                {
                text: 'Keep studying!',
                style: 'cancel',
                },
                {
                    text: `I'm sure, cancel.`,
                    onPress: () => resetPomodoro(),
                    style: 'default',
                },
            ],
            {
                cancelable: false,
            },
        );
    }

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
            setTotalTime(0);
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
    const [containerWidth, setContainerWidth] = useState(250);
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
  
    /*const handleLayout = (event: { nativeEvent: { layout: { width: any; }; }; }) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };*/
  
    useEffect(() => {
        calculatePercentageFilled();
    }, [timer]);

    return (
        <View>
            <View style={{  
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',

                    borderColor: themeColors.borderSubtle,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 10
                }}>

                {/* RENDER TIMER NAME DEPENDING ON STATE */}
                { running || paused ? (
                    <View>
                        { studying ? (
                            <Text style={{
                                fontSize: 48,
                                color: themeColors.text
                            }}>Study</Text>
                        ) : (
                            <Text style={{
                                fontSize: 48,
                                color: themeColors.text
                            }}>Break</Text>
                        )}
                    </View>
                ) : null}

                {/* RENDER STUDY/BREAK TOGGLE */}
                { stopped ? (
                    <View style={{
                        flexDirection: 'row'
                        }}>
                        <Pressable onPress={() => {
                                setStudying(true);
                            }}
                            style={{
                                marginRight: 5,
                                backgroundColor: (studying ? themeColors.backgroundSelected : themeColors.background),
                                padding: 5,
                                borderRadius: 8
                                }}>
                            <Text style={{
                                fontSize: 14,
                                color: themeColors.text
                            }}>Study</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                                setStudying(false);
                            }}
                            style={{
                                marginRight: 5,
                                backgroundColor: (studying ? themeColors.background : themeColors.backgroundSelected),
                                padding: 5,
                                borderRadius: 8
                                }}>
                            <Text style={{
                                fontSize: 14,
                                color: themeColors.text
                            }}>Break</Text>
                        </Pressable> 
                    </View>
                ) : null}

                {/* RENDER TIMER AND PROGRESS BAR */}
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 250
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

                <View>
                    {stopped ? (
                        <View>
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
                        </View>
                    ) : null}
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
                    ) : null}
                    { paused ? (
                        <Pressable onPress={showAlert}
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
                    ) : null}
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
                    ) : null}
                    {/*<Pressable onPress={() => setTimer(5)}
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
                        }}>TEST BUTTON</Text> 
                    </Pressable>*/}
                </View>
            </View>

            {/* RENDER TOTAL TIME OUTPUT */}
            {!loading ? (
                <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                
                        marginTop: 40,
                        borderColor: themeColors.borderSubtle,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 10
                    }}>
                    <View style={{}}>
                        <Text style={{
                                fontSize: 14,
                                color: themeColors.text
                            }}>Total study time this session: {formatTime(totalTime)}</Text>
                    </View>
                    <View style={{
                        marginTop: 5,
                    }}>
                        <Text style={{
                                fontSize: 14,
                                color: themeColors.text
                            }}>Study blocks completed this session: {completedBlocks}</Text>
                    </View>
                    { (stopped || paused) && !(totalTime === 0) ? (
                        <View style={{
                            marginTop: 12,
                            width: '100%',
                            height: 40,
                        }}>
                            <Pressable onPress={() => logSessionStats(totalTime, completedBlocks)}
                                style={{
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
                                }}>Log Session Stats</Text> 
                            </Pressable>
                        </View>
                    ) : (
                        <View></View>
                    )}
                </View>
            ) : (
                <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                
                        marginTop: 40,
                        borderColor: themeColors.borderSubtle,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 10
                    }}>
                    <ActivityIndicator size='large' color={themeColors.tint}/>
                </View>
            )}
        </View>
    )
}

export default PomodoroTimer