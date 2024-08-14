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
        labels: sortedTotals.map(total => total.date.toDate().toLocaleDateString('en-US', { weekday: 'short' }).substring(0,1)),
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
    
    const chartWidth = Dimensions.get('window').width * 0.8;

    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            borderWidth: 1,
            borderColor: themeColors.borderSubtle,
            padding: 10,
            borderRadius: 8,
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
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
            <View style={{
                flexDirection: 'column',
                width: '80%',
                alignItems: 'center',
                transform: [{ translateX: -10 }],
                marginVertical: 8,
            }}>
                <BarChart
                    data={data}
                    width={chartWidth}
                    height={200}
                    yAxisSuffix="m"
                    yAxisLabel=""
                    fromZero={true}
                    withInnerLines={false}
                    showValuesOnTopOfBars={false}
                    chartConfig={{
                        barPercentage: 0.7,
                        barRadius: 8,
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
                            rotation: 0,
                            fontSize: 14,
                        },
                    }}
                />
            </View>
        </View>
    )
}

export default MetricsBarChart