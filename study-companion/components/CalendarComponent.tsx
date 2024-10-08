import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import * as ExpoCalendar from 'expo-calendar';
import { Calendar, CalendarProps, DateData } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

//Color schemes
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

//Databases
import { sqliteManager } from '../sqlite/sqlite-config';

interface CalendarComponentProps {
    onSelectDates: (dates: string[]) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onSelectDates }) => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [selectedDates, setSelectedDates] = useState<{ [index: number]: { date: Date, selected: boolean } }>({});
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
    const [dates, setDates] = useState<string[]>([]);
    const [invalidTime, setInvalidTime] = useState(false);
    const [invalidEntries, setInvalidEntries] = useState(false);

    //Get calendar permissions
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

        //Get the dates that are selected and write to dates array
        const newDates = Object.values(selectedDates)
            .filter(date => date.selected)
            .map(date => date.date.toISOString().split('T')[0]);
        setDates(newDates);

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
            const selectedDate = new Date(day.dateString);
            const index = selectedDate.getTime(); //Use timestamp as the index

            if (newSelectedDates[index]) {
                delete newSelectedDates[index];
            } else {
                newSelectedDates[index] = { date: selectedDate, selected: true };
            }

            setSelectedDates(newSelectedDates);
            onSelectDates(Object.values(newSelectedDates).map(date => date.date.toISOString().split('T')[0]));
        } else {
            // Check if the selected date is in the past
            console.log("Cannot select past dates.");
            Alert.alert('Error', 'Cannot select past dates.');
        }
    };

    //Update timers when all day event is toggled
    useEffect(() => {
        if (isAllDay) {
            setStartTime('00:00');
            setEndTime('23:59');
        } else {
            setStartTime('');
            setEndTime('');
        }
    }, [isAllDay]);

    //Update invalidEntries based on the conditions
    useEffect(() => {
        const isInvalid = 
            startTime.length < 5 || 
            endTime.length < 5 || 
            eventTitle.trim() === '' || 
            eventDescription.trim() === '' || 
            invalidTime;

        setInvalidEntries(isInvalid);
    }, [startTime, endTime, eventTitle, eventDescription, invalidTime]);

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

    const handleCreateEvent = async () => {
        //Single day implementation
        if (!multipleDates) {
            //Extract event details from state variables
            const title = eventTitle.trim();
            const description = eventDescription.trim();
            const start = startTime.trim();
            const end = endTime.trim();
            const allDay = isAllDay;
            const selectedDate = dates[0];
        
            //This is already accounted for, but just incase!
            if (title === '' || description === '' || start.length < 5 || end.length < 5 || invalidTime) {
                alert('Please fill in all required fields with valid data.');
                return;
            }

            //Create event object
            const newEvent = {
                title,
                description,
                startTime: start,
                endTime: end,
                isAllDay: allDay,
                
            };

            // Convert start and end times to Date objects
            const startDate = new Date(start);
            const endDate = new Date(end);

            // Validate date values
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                alert('Invalid date values. Please check the start and end times.');
                return;
            }

            try {
                //Get calendar permissions
                const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
                if (status !== 'granted') {
                    alert('Calendar permissions are required to save events.');
                    return;
                }

                //Get default calendar
                const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
                const defaultCalendar = calendars.find(calendar => calendar.source.name === 'Default');
                const calendarId = defaultCalendar ? defaultCalendar.id : calendars[0].id;

                //Save event to the calendar
                await ExpoCalendar.createEventAsync(calendarId, {
                    title: newEvent.title,
                    notes: newEvent.description,
                    startDate: new Date(newEvent.startTime),
                    endDate: new Date(newEvent.endTime),
                    allDay: newEvent.isAllDay,
                    timeZone: 'GMT', //Adjust the time zone as needed
                });

                //Clear input fields after saving
                setEventTitle('');
                setEventDescription('');
                setStartTime('');
                setEndTime('');
                setIsAllDay(true);
                setSelectedDates({});
                alert('Event created successfully!');

                //Save event to local storage
                saveSingleDayEvent(newEvent);
            } catch (error) {
                console.error('Error creating event:', error);
                alert('Failed to create event. Please try again.');
            }
        }
    
        //Multiday implementation
        if (multipleDates) {
            //Handle multi-day events
        }
    };
    
    //Placeholder function for saving the event (replace with your actual save logic)
    const saveSingleDayEvent = async (event: { title: string; description: string; startTime: string; endTime: string; isAllDay: boolean; }) => {
        console.log('Saving event:', event);

        sqliteManager.insertSingleDayEvent(event);
    };

    //Prepare markedDates object for the calendar
    const markedDates = Object.values(selectedDates).reduce((acc, { date, selected }) => {
        const dateString = date.toISOString().split('T')[0];
        acc[dateString] = { selected };
        return acc;
    }, {} as { [key: string]: { selected: boolean } });

    const calendarProps: CalendarProps = {
        markedDates: markedDates,
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
                                <Pressable style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    }}
                                    onPress={() => setIsAllDay(!isAllDay)}>
                                    <Text style={{
                                        color: !isAllDay ? themeColors.subtleText : themeColors.text,
                                        fontSize: 14,
                                        marginRight: 6,
                                    }}>All day event</Text>
                                    <View style={{
                                        borderWidth: 2,
                                        borderRadius: 4,
                                        borderColor: isAllDay ? themeColors.tint : themeColors.borderSubtle,
                                        backgroundColor: isAllDay ? themeColors.tint : themeColors.background,
                                        width: 20,
                                        height: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        { isAllDay ? 
                                            <Feather name='check' color={themeColors.text} size={16}/> 
                                        : null }
                                    </View>
                                </Pressable>
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

                                { isAllDay ? null : (
                                    <View style={{
                                        marginBottom: 12,
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <Text style={{
                                                    color: themeColors.text,
                                                    fontSize: 14,
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
                                    </View>
                                )}

                                {/* RENDER CREATE EVENT BUTTON BASED ON VALIDITY OF ENTRIES */}
                                {invalidEntries ? (
                                    <View style={{
                                        width: '100%',
                                        alignItems: 'center',
                                    }}>
                                        {invalidTime && (
                                            <Text style={{
                                                color: themeColors.borderAlert,
                                                textAlign: 'center',
                                                marginTop: 0
                                            }}>Please ensure time is formatted HH:MM.</Text>
                                        )}
                                        <Text style={{
                                            color: themeColors.textAlert,
                                            fontSize: 14,
                                            textAlign: 'center'
                                        }}>Please ensure all fields are filled out correctly.</Text>
                                        <Pressable
                                            style={{
                                                width: '80%',
                                                height: 40,
                                                borderRadius: 8,
                                                backgroundColor: themeColors.borderSubtle,
                                                marginTop: 12,
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
                                    <Pressable onPress={handleCreateEvent}
                                        style={{
                                            width: '80%',
                                            height: 40,
                                            borderRadius: 8,
                                            backgroundColor: themeColors.tint,
                                            marginTop: 12,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            <Text style={{
                                                fontSize: 14,
                                                color: themeColors.text,
                                            }}>Create event</Text>        
                                    </Pressable>
                                )}
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