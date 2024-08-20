import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars'

//Color schemes
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';

const CalendarPageCalendar = () => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
    //Calendar logic
    const [selected, setSelected] = useState("");

    return (
        <View>
            <Calendar style={{
                margin: 12,
                borderWidth: 1,
                borderColor: themeColors.borderSubtle,
                borderRadius: 8
                }}
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
                enableSwipeMethods={true}
                onDayPress={(day: any) => {
                    setSelected(day);
                    console.log('Selected day: ', day);
                }}
                markedDates={{
                    [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
            />
        </View>
    )
}

export default CalendarPageCalendar