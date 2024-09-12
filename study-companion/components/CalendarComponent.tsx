import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import * as ExpoCalendar from 'expo-calendar';
import { Calendar, CalendarProps, DateData } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

//Color schemes
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { todayString } from 'react-native-calendars/src/expandableCalendar/commons';
import Checkbox from 'expo-checkbox';

interface CalendarComponentProps {
    onSelectDates: (dates: string[]) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onSelectDates }) => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [selectedDates, setSelectedDates] = useState<{ [date: string]: { selected: boolean } }>({});
    const [multipleDates, setMultipleDates] = useState(false);
    const [zeroDates, setZeroDates] = useState(true);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());
    const [isAllDay, setIsAllDay] = useState(true);

    //Time inputs and state
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [invalidTime, setInvalidTime] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
                console.log('Available calendars:', calendars);
            }
        })();
    }, []);

    //Update multipleDates to match how many dates are currently selected.
    useEffect(() => {
        //Filter selectedDates down to an array of just the dates
        const selectedCount = Object.values(selectedDates).filter(date => date.selected).length;
        console.log(selectedCount);
        if (selectedCount >= 0) {
            if (selectedCount === 0) {
                setZeroDates(true);
                setMultipleDates(false);
            } else if (selectedCount === 1) {
                setMultipleDates(false);
                setZeroDates(false);
            } else {
                setMultipleDates(true);
                setZeroDates(false);
            }
        }
    }, [selectedDates])

    const handleDayPress = (day: DateData) => {
        const today = new Date();

        //Get today's date in YYYY-MM-DD format
        const todayDateString = today.toISOString().split('T')[0];
    
        if (day.dateString >= todayDateString) {
            const newSelectedDates = { ...selectedDates };
            if (newSelectedDates[day.dateString]) {
                delete newSelectedDates[day.dateString];
            } else {
                newSelectedDates[day.dateString] = { selected: true };
            }
            setSelectedDates(newSelectedDates);
            onSelectDates(Object.keys(newSelectedDates));
            return;
        } else {
            // Check if the selected date is in the past
            console.log("Cannot select past dates.");
            Alert.alert('Error', 'Cannot select past dates.');
            return;
        }
    };

    //Handle event creation
    const handleCreateEvent = async () => {
        if (eventTitle && Object.keys(selectedDates).length > 0) {
            try {
                const calendar = await ExpoCalendar.getDefaultCalendarAsync();
                const selectedDatesList = Object.keys(selectedDates);
    
                if (selectedDatesList.length === 1) {
                    // Create a single-day event
                    const eventDate = new Date(selectedDatesList[0]);
                    const startDate = isAllDay ? eventDate : new Date(eventDate.setHours(eventStartTime.getHours(), eventStartTime.getMinutes()));
                    const endDate = isAllDay ? eventDate : new Date(eventDate.setHours(eventEndTime.getHours(), eventEndTime.getMinutes()));
                    const event = {
                        title: eventTitle,
                        notes: eventDescription,
                        startDate: startDate,
                        endDate: endDate,
                        allDay: isAllDay,
                    };
                    await ExpoCalendar.createEventAsync(calendar.id, event);
                    alert('Single-day event created successfully!');
                } else {
                    // Create separate events for each selected date
                    for (const date of selectedDatesList) {
                        const eventDate = new Date(date);
                        const startDate = isAllDay ? eventDate : new Date(eventDate.setHours(eventStartTime.getHours(), eventStartTime.getMinutes()));
                        const endDate = isAllDay ? eventDate : new Date(eventDate.setHours(eventEndTime.getHours(), eventEndTime.getMinutes()));
                        const event = {
                            title: eventTitle,
                            notes: eventDescription,
                            startDate: startDate,
                            endDate: endDate,
                            allDay: isAllDay,
                        };
                        await ExpoCalendar.createEventAsync(calendar.id, event);
                    }
                    alert('Multiple events created successfully!');
                }
            } catch (error) {
                console.error('Error creating event:', error);
                alert('Failed to create event.');
            }
        } else {
            alert('Please enter an event title and select at least one date.');
        }
    };

    //Validate time input on time change
    useEffect(() => {
        //Regex for time input
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const timeRegexArray = [
            /^[0-2]$/,  //Char 1: 0-2
            /^[0-9]$/,  //Char 2: 0-9
            /^(:)$/,    //Char 3: :
            /^[0-5]$/,  //Char 4: 0-5
            /^[0-9]$/   //Char 5: 0-9
        ];
    
        const validateTime = (text: string) => {
            //Set limit of 5 characters for time input
            if (text.length <= 5) {
                //Check each index of the input against the corresponding regex
                let isValid = true;
                for (let i = 0; i < text.length; i++) {
                    if (!text.charAt(i).match(timeRegexArray[i])) {
                        isValid = false;
                        break;
                    }
                }
                
                //Check full time regex if input is 5 characters long
                if (isValid && text.length === 5) {
                    isValid = timeRegex.test(text);
                }
    
                //Update invalid time state
                setInvalidTime(!isValid);
            } else {
                //If input is longer than 5 characters, it must be invalid
                setInvalidTime(true);
            }
        };
    
        //Validate both start and end times
        validateTime(startTime);
        validateTime(endTime);
    }, [startTime, endTime]);

    const handleSetTime = (text: string, type: 'start' | 'end') => {
        //Regex for time input
        const timeRegexArray = [
            /^[0-2]$/,  //Char 1: 0-2
            /^[0-9]$/,  //Char 2: 0-9
            /^(:)$/,    //Char 3: :
            /^[0-5]$/,  //Char 4: 0-5
            /^[0-9]$/   //Char 5: 0-9
        ];
    
        //Check each index of the input against the corresponding regex
        let isValid = true;

        for (let i = 0; i < text.length; i++) {
            if (!text.charAt(i).match(timeRegexArray[i])) {
                isValid = false;
                break;
            }
        }
    
        //Only update text state if the input is valid
        if (isValid && text.length <= 5) {
            if (type === 'start') {
                setStartTime(text);
            } else {
                setEndTime(text);
            }
        } else {
            setInvalidTime(true);
        }
    };

    const calendarProps: CalendarProps = {
        markedDates: selectedDates,
        onDayPress: handleDayPress,
        markingType: 'multi-dot',
    };

    return (
        <ScrollView style={{
            backgroundColor: themeColors.background,
            }}>
            {/* RENDER CALENDAR */}
            <Calendar {...calendarProps} 
                theme={{
                    backgroundColor: themeColors.background,
                    calendarBackground: themeColors.background,
                    textSectionTitleColor: themeColors.text,
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: themeColors.tint,
                    dayTextColor: themeColors.text,
                    textDisabledColor: themeColors.subtleText,
                    dotColor: themeColors.tint,
                    selectedDotColor: themeColors.tint,
                    arrowColor: themeColors.tabIconDefault,
                    monthTextColor: themeColors.text,
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16,
                }}
                style={{
                    margin: 12,
                    borderWidth: 1,
                    borderColor: themeColors.borderSubtle,
                    borderRadius: 8,
                }}
            />

            {/* RENDER EVENT ENTRY */}
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                margin: 12,
                borderWidth: 1,
                borderColor: themeColors.borderSubtle,
                borderRadius: 8,
                padding: 12
                }}>
                { !zeroDates ? (
                    <View style={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            color: themeColors.text,
                            fontSize: 24,
                            textAlign: 'center',
                            marginBottom: 12,
                        }}>Create an event</Text>
                        { !multipleDates ? (
                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    }}>
                                    <Text style={{
                                        color: !isAllDay ? themeColors.subtleText : themeColors.text,
                                        fontSize: 14,
                                        marginRight: 12,
                                    }}>All day event</Text>
                                    <Checkbox
                                        value={isAllDay}
                                        onValueChange={setIsAllDay}
                                        color={themeColors.tint}
                                    />
                                    {/*<Switch
                                        value={isAllDay}
                                        onValueChange={setIsAllDay}
                                        thumbColor={themeColors.tint}
                                        trackColor={{
                                            true: themeColors.tint,
                                            false: themeColors.borderSubtle,
                                        }}
                                        style={{
                                            marginVertical: 0,
                                        }}
                                    />*/}
                                </View>
                                <TextInput
                                    style={{
                                        color: themeColors.text,
                                        borderColor: themeColors.borderSubtle,
                                        width: '100%',
                                        height: 40,
                                        borderBottomWidth: 1,
                                        borderRadius: 8,
                                        marginBottom: 12,
                                        paddingVertical: 10,
                                        paddingHorizontal: 10,
                                    }}
                                    placeholder="Event title"
                                    placeholderTextColor={themeColors.subtleText}
                                    value={eventTitle}
                                    onChangeText={setEventTitle}
                                />
                                <TextInput
                                    style={{
                                        color: themeColors.text,
                                        borderColor: themeColors.borderSubtle,
                                        width: '100%',
                                        minHeight: 40,
                                        maxHeight: 80,
                                        height: (eventDescription.length <= 0) ? 40 :'auto',
                                        marginBottom: 12,
                                        borderBottomWidth: 1,
                                        borderRadius: 8,
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                    }}
                                    multiline={true}
                                    placeholder="Event description"
                                    placeholderTextColor={themeColors.subtleText}
                                    value={eventDescription}
                                    onChangeText={setEventDescription}
                                />
                                
                                {/*<View style={{
                                    width: '100%',
                                    height: 1,
                                    backgroundColor: themeColors.borderSubtle,
                                    marginTop: 12,
                                }} />*/}

                                { isAllDay ? null : (
                                    <View style={{
                                        marginBottom: 12,
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                                <Text style={{
                                                    color: themeColors.text,
                                                    fontSize: 14,
                                                    marginRight: 12,
                                                }}>Start time:</Text>
                                                <TextInput style={{
                                                    color: themeColors.text,
                                                    borderColor: invalidTime ? themeColors.borderAlert : themeColors.borderSubtle,
                                                    height: 40,
                                                    borderBottomWidth: 1,
                                                    borderRadius: 8,
                                                    marginRight: 12,
                                                    paddingHorizontal: 10,
                                                    fontSize: 14,
                                                    textAlign: 'center',
                                                    }}
                                                    value={startTime}
                                                    placeholder='00:00'
                                                    placeholderTextColor={themeColors.subtleText}
                                                    onChangeText={(text) => handleSetTime(text, 'start')}
                                                ></TextInput>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                                <Text style={{
                                                    color: themeColors.text,
                                                    fontSize: 14,
                                                    marginRight: 12,
                                                }}>End time:</Text>
                                                <TextInput style={{
                                                    color: themeColors.text,
                                                    borderColor: invalidTime ? themeColors.borderAlert : themeColors.borderSubtle,
                                                    height: 40,
                                                    borderBottomWidth: 1,
                                                    borderRadius: 8,
                                                    paddingHorizontal: 10,
                                                    fontSize: 14,
                                                    textAlign: 'center',
                                                    }}
                                                    value={endTime}
                                                    placeholder='00:00'
                                                    placeholderTextColor={themeColors.subtleText}
                                                    onChangeText={(text) => handleSetTime(text, 'end')}
                                                ></TextInput>
                                            </View>
                                        </View>
                                        {invalidTime && (
                                            <Text style={{
                                                color: themeColors.borderAlert,
                                                textAlign: 'center',
                                                marginTop: 5
                                            }}>Please ensure time is formatted HH:MM.</Text>
                                        )}
                                    </View>
                                )}
                                <Pressable onPress={handleCreateEvent}
                                    style={{
                                        width: '80%',
                                        height: 40,
                                        borderRadius: 8,
                                        backgroundColor: themeColors.tint,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: themeColors.text,
                                        }}>Create event</Text>        
                                </Pressable>
                            </View>
                        ) : (
                            <View>
                                <Text style={{
                                    color: themeColors.text,
                                    fontSize: 14,
                                    textAlign: 'center'
                                    }}>Multiple dates selected.</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View>
                        <Text style={{
                            color: themeColors.subtleText,
                            fontSize: 14,
                            textAlign: 'center'
                            }}>You haven't selected any dates yet,
                                select one or more to get started with calendar events.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default CalendarComponent;