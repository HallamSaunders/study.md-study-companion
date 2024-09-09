import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Pressable } from 'react-native';
import * as ExpoCalendar from 'expo-calendar';
import { Calendar, CalendarProps, DateData } from 'react-native-calendars';

//Color schemes
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';

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
        const newSelectedDates = { ...selectedDates };
        if (newSelectedDates[day.dateString]) {
            delete newSelectedDates[day.dateString];
        } else {
            newSelectedDates[day.dateString] = { selected: true };
        }
        setSelectedDates(newSelectedDates);
        onSelectDates(Object.keys(newSelectedDates));
    };

    //Handle event creation
    const handleCreateEvent = async (
        //Pass in information regarding timings of the event
        //isAllDay: boolean,
        //eventStart: Date,
        //eventEnd: Date,
        //eventisAllDay: boolean
    ) => {
        if (eventTitle && Object.keys(selectedDates).length > 0) {
            if (eventTitle && Object.keys(selectedDates).length > 0) {
                try {
                    const calendar = await ExpoCalendar.getDefaultCalendarAsync();
                    const selectedDatesList = Object.keys(selectedDates);
    
                    if (selectedDatesList.length === 1) {
                        // Create a single-day event
                        const eventDate = new Date(selectedDatesList[0]);
                        const event = {
                            title: eventTitle,
                            notes: eventDescription,
                            startDate: eventDate,
                            endDate: eventDate,
                            allDay: true,
                        };
                        await ExpoCalendar.createEventAsync(calendar.id, event);
                        alert('Single-day event created successfully!');
                    } else {
                        // Create separate events for each selected date
                        for (const date of selectedDatesList) {
                            const eventDate = new Date(date);
                            const event = {
                                title: eventTitle,
                                notes: eventDescription,
                                startDate: eventDate,
                                endDate: eventDate,
                                allDay: true,
                            };
                            await ExpoCalendar.createEventAsync(calendar.id, event);
                        }
                        alert('Multiple events created successfully!');
                    }
    
                    setEventTitle('');
                    setEventDescription('');
                    setSelectedDates({});
                } catch (error) {
                    console.error('Error creating event:', error);
                    alert('Failed to create event(s). Please try again.');
                }
            } else {
                alert('Please enter an event title and select at least one date.');
            }
        } else {
            Alert.alert('Error', 'Please enter an event title and select at least one date.');
        }
    };

    const calendarProps: CalendarProps = {
        markedDates: selectedDates,
        onDayPress: handleDayPress,
        markingType: 'multi-dot',
    };

    return (
        <View style={{
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
                        }}>Create an event.</Text>
                        { !multipleDates ? (
                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                            }}>
                                {/*<Text style={{
                                    color: themeColors.text,
                                    fontSize: 14,
                                    textAlign: 'center',
                                    marginBottom: 12, }}>
                                    { !multipleDates ? 'One date selected.' : 'Multiple dates selected.' }
                                </Text>*/}
                                <TextInput
                                    style={{
                                        color: themeColors.text,
                                        borderColor: themeColors.borderSubtle,
                                        width: '100%',
                                        height: 40,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        marginBottom: 12,
                                        paddingHorizontal: 10,
                                    }}
                                    placeholder="Event Title"
                                    placeholderTextColor={themeColors.subtleText}
                                    value={eventTitle}
                                    onChangeText={setEventTitle}
                                />
                                <TextInput
                                    style={{
                                        color: themeColors.text,
                                        borderColor: themeColors.borderSubtle,
                                        width: '100%',
                                        height: 40,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        marginBottom: 12,
                                        paddingHorizontal: 10,
                                    }}
                                    placeholder="Event Description"
                                    placeholderTextColor={themeColors.subtleText}
                                    value={eventDescription}
                                    onChangeText={setEventDescription}
                                />
                                <Pressable onPress={handleCreateEvent}
                                    style={{
                                        width: '80%',
                                        height: 40,
                                        borderRadius: 8,
                                        backgroundColor: themeColors.tint,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 12
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
        </View>
    );
};

export default CalendarComponent;