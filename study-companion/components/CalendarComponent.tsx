import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
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
    const [dragStartDate, setDragStartDate] = useState<string | null>(null);
    
    useEffect(() => {
        (async () => {
        const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
            console.log('Available calendars:', calendars);
        }
        })();
    }, []);

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

    const handleDayLongPress = (day: DateData) => {
        setDragStartDate(day.dateString);
    };

    const handleDayDrag = (day: DateData) => {
        if (dragStartDate) {
            const startDate = new Date(dragStartDate);
            const endDate = new Date(day.dateString);
            const newSelectedDates = { ...selectedDates };

            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dateString = currentDate.toISOString().split('T')[0];
                newSelectedDates[dateString] = { selected: true };
                currentDate.setDate(currentDate.getDate() + 1);
            }

            setSelectedDates(newSelectedDates);
            onSelectDates(Object.keys(newSelectedDates));
        }
    };

    const calendarProps: CalendarProps = {
        markedDates: selectedDates,
        onDayPress: handleDayPress,
        onDayLongPress: handleDayLongPress,
        //onDayPress: dragStartDate ? handleDayDrag : handleDayPress,
        markingType: 'multi-dot',
    };

    return (
        <View>
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
                    textDayHeaderFontSize: 16
                }}
                style={{
                    margin: 12,
                    borderWidth: 1,
                    borderColor: themeColors.borderSubtle,
                    borderRadius: 8
                }}
            />
        </View>
    );
};

export default CalendarComponent;