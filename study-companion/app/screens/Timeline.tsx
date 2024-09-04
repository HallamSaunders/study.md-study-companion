import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

//Color schemes
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

//SQLite and database
import { sqliteManager } from '../../sqlite/sqlite-config';

export interface DailyTotal {
    date: string;
    time: number;
    blocks: number;
}

const Timeline = () => {
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    //Get all past data items
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState<DailyTotal[]>([]);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const result = await sqliteManager.getSessionsPastWeek();
            setSessions(result as DailyTotal[]);
            console.log(result);
        } catch (error) {
            console.error("Error loading sessions:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadSessions();
    }, []);

    return (
        <View>
            <Text style={{
                fontSize: 14,
                color: themeColors.text,
            }}>Timeline</Text>
        </View>
    )
}

export default Timeline