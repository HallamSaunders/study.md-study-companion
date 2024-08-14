import { View, Text, Dimensions, LayoutChangeEvent, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BarChart, LineChart } from 'react-native-chart-kit'

//Firestore and database
import { getLastSevenDaysSessionTotals } from '../firebase/metricsQuerying';
import { Timestamp } from 'firebase/firestore';

//Color schemes
import { useColorScheme } from './useColorScheme';
import Colors from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

interface DailyTotal {
    time: number,
    date: Timestamp
}

const MetricsBarChart = () => {   
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);

    //Rate limiting to stop reads from increasing constantly
    const [rateLimit, setRateLimit] = useState<number>(0);

    //Fetch data for last 7 days
    const fetchData = async () => {
        if (rateLimit === 0) {
            try {
                const totals = await getLastSevenDaysSessionTotals();
                setDailyTotals(totals);
            } catch (error) {
                console.error('Error fetching daily totals:', error);
            }
            //Set refresh rate limit to 2 minutes
            setRateLimit(120);
            setTimeout(() => setRateLimit(0), 120000);
        }
    };

    useEffect(() => {
        //This is called whenever the component mounts
        if (dailyTotals.length === 0) {
            fetchData();
        }
    }, []);

    //Sort data by date, trim down to useful dates, and convert time to mins
    const sortedTotals = [...dailyTotals].sort((a, b) => a.date.toMillis() - b.date.toMillis());
    const data = {
        labels: sortedTotals.map(total => total.date.toDate().toLocaleDateString('en-US', { weekday: 'short' })),
        datasets: [{
            data: sortedTotals.map(total => total.time / 60) //Convert time to minutes
        }]
    };

    const updateGraph = async () => {
        fetchData();
    }

    //Handle width and height of chart
    const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setChartDimensions({ width, height });
    }, []);

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center'
            }}>
                <Text style={{
                    fontSize: 20,
                }}>MetricsBarChart</Text>
                <Pressable onPress={() => updateGraph()}
                    style={{
                        justifyContent: 'flex-end'
                    }}>
                    <Feather name='download-cloud' size={18} color={themeColors.tabIconDefault}/>
                </Pressable>
            </View>
            <BarChart
                data={data}
                width={Dimensions.get('window').width * 0.8}
                height={200}
                yAxisSuffix="m"
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: themeColors.background,
                    backgroundGradientFrom: themeColors.background,
                    backgroundGradientTo: themeColors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => themeColors.tint,
                    labelColor: (opacity = 1) => themeColors.text,
                    style: {
                        borderRadius: 8,
                    },
                    propsForVerticalLabels: {
                        rotation: -30,
                        fontSize: 14,
                    }
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    )
}

export default MetricsBarChart