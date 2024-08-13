import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

//Color schemes
import { useColorScheme } from './useColorScheme';
import Colors from '../constants/Colors';

//Firestore refs
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebase/firebase-config';
import { getUserDocID } from '../firebase/databaseCalls';

interface sessionData {
    time: number,
    blocks: number,
    timestamp: Timestamp,
    type: string
}

const RegularTimer = () => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    
    //Timers
    const [timer, setTimer] = useState(0);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [stopped, setStopped] = useState(true);

    //Metrics for session
    const [totalTime, setTotalTime] = useState(0);

    const [loading, setLoading] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    //Handle states when running/paused/stopped
    useEffect(() => {
        if (running && !paused) {
            timerRef.current = setInterval(() => {
                setTimer((prevInterval) => {
                    return prevInterval + 1;
                });

                setTotalTime((prevInterval) => {
                    return prevInterval + 1;
                });
            }, 1000);
        }

        //Cleanup interval on unmount or when running/working/paused changes
        return () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null; //Reset after clearing
            }
        };
    }, [running, paused, stopped])

    //Handle logic for saving stats to database
    const logSessionStats = async (totalTime: number) => {
        if (!(totalTime === 0)) {
            
            setLoading(true);
            //Write data to user/{uid}/sessions
            try {
                const sessionData: sessionData = {
                    time: totalTime,
                    blocks: 0,
                    timestamp: Timestamp.now(),
                    type: 'timer'
                };

                console.log(FIREBASE_AUTH.currentUser);

                //Add document with userDoc reference
                const userDocId = await getUserDocID();
                const docRef = await addDoc(collection(FIRESTORE_DB, `users/${userDocId}/sessions`), sessionData);

                console.log("Doc: ", docRef);

                //Reset total time
                setTotalTime(0);
                resetStopwatch();
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
                    onPress: () => resetStopwatch(),
                    style: 'default',
                },
            ],
            {
                cancelable: false,
            },
        );
    }

    const startStopwatch = () => {
        if (stopped || paused) {
            setRunning(true);
            setPaused(false);
            setStopped(false);
        }
    };

    const pauseStopwatch = () => {
        if (running) {
            setRunning(false);
            setPaused(true);
            setStopped(false);
        }
    };
    
    const resetStopwatch = () => {
        if (paused) {
            setRunning(false);
            setPaused(false);
            setStopped(true);

            setTimer(0);
            setTotalTime(0);
        }
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
        const percentFilled = ((timer % 60) / 60);
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

                {/* RENDER TIMER AND PROGRESS BAR */}
                <View onLayout={handleLayout} style={{
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

                {/* RENDER BUTTONS DEPENDING ON STATE OF TIMERS */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 20
                }}>
                    { stopped || paused ? (
                        <Pressable onPress={() => startStopwatch()}
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
                    ) : (
                        <View></View>
                    )}
                    { running ? (
                        <Pressable onPress={() => pauseStopwatch()}
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
                    <Pressable onPress={() => setTimer(55)}
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
                    </Pressable>
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
                        <Text>Total study time this session: {formatTime(totalTime)}</Text>
                    </View>

                    { (stopped || paused) && !(totalTime === 0) ? (
                        <View style={{
                            marginTop: 5,
                            width: '100%',
                            height: 40,
                        }}>
                            <Pressable onPress={() => logSessionStats(totalTime)}
                                style={{
                                    flex: 1,
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

export default RegularTimer