import { StyleSheet, Text, TouchableHighlightComponent, View } from 'react-native'
import React, { useEffect, useState } from 'react'

//Calendars
import * as ExpoCalendar from 'expo-calendar';
import { Calendar } from 'react-native-calendars';
import CalendarPageCalendar from '../../components/CalendarPageCalendar';
import CalendarComponent from '../../components/CalendarComponent';
import CreateCalendarEvent from '../../components/CreateCalendarEvent';

//Color schemes
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CalendarScreen() {
  //Color schemes and setup
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  const handleSelectDates = (dates: string[]) => {
    console.log('Selected dates:', dates);
    //Do something with the selected dates
  };

  return (
    <View style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <CalendarComponent onSelectDates={handleSelectDates} />
    </View>
  )
}