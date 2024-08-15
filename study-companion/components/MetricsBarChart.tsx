import { View, Text, Dimensions, LayoutChangeEvent, Pressable, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BarChart } from 'react-native-chart-kit'
import { NavigationProp } from '@react-navigation/native';

//Firestore and database
import { getLastSevenDaysSessionTotals } from '../firebase/metricsQuerying';
import { Timestamp } from 'firebase/firestore';

//Color schemes
import { useColorScheme } from './useColorScheme';
import Colors from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

interface DailyTotal {
    time: number,
    blocks: number,
    date: Timestamp
}

interface weeklyData {
    dailyTotals: DailyTotal[],
    weeklyAverage: number,
    totalBlocks: number,
    avgTimePerBlock: number
}

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const MetricsBarChart = ({ navigation }: RouterProps) => {   
    //Color schemes
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
    const [weeklyData, setWeeklyData] = useState<weeklyData>();

    //Rate limiting to stop reads from increasing constantly
    const [rateLimit, setRateLimit] = useState<number>(0);

    const [loading, setLoading] = useState(false);

    //Fetch data for last 7 days
    const fetchData = async () => {
        if (rateLimit === 0) {
            setLoading(true);
            try {
                const weeklyData: weeklyData = await getLastSevenDaysSessionTotals();
                setWeeklyData(weeklyData);
                setDailyTotals(weeklyData.dailyTotals);
            } catch (error) {
                console.error('Error fetching daily totals:', error);
            }
            //Set refresh rate limit to 2 minutes
            setRateLimit(120);
            setTimeout(() => setRateLimit(0), 120000);
        }
        setLoading(false);
    };

    useEffect(() => {
        //This is called whenever the component mounts
        if (dailyTotals.length === 0 || weeklyData === undefined) {
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
        <View>
            {loading ? (
                <View>
                    <ActivityIndicator size='large' color={themeColors.tint}/>
                </View>
            ) : (
                    <View>
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
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: themeColors.text
                            }}>Your weekly recap</Text>
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
                            transform: [{ translateX: 25 }],
                            marginTop: 12,
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
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginTop: 40,
                        padding: 10,
                        borderRadius: 8,
                        width: '100%'
                        }}>
                        <Text style={{
                                fontSize: 20,
                                color: themeColors.text
                            }}>Your weekly stats</Text>
                        <View>
                            {!(weeklyData === undefined) ? (
                                <View>
                                    <Text style={{
                                        fontSize: 14,
                                        color: themeColors.text,
                                        marginTop: 12,
                                        }}>
                                        &middot; You averaged {Math.round(weeklyData.weeklyAverage / 60)} minutes of study per day.
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: themeColors.text
                                        }}>
                                        &middot; You completed {Math.round(weeklyData.totalBlocks)} Pomodoro study blocks.
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: themeColors.text
                                        }}>
                                        &middot; That means the average length of a Pomodoro study block was {Math.round(weeklyData!.avgTimePerBlock / 60)} minutes!
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                        <Text style={{
                                            fontSize: 14,
                                            color: themeColors.text,
                                            marginTop: 12,
                                            }}>
                                            &middot; You averaged ____ minutes of study per day.
                                        </Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: themeColors.text
                                            }}>
                                            &middot; You completed ____ Pomodoro study blocks.
                                        </Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: themeColors.text
                                            }}>
                                            &middot; That means the average length of a Pomodoro study block was ____ minutes!
                                        </Text>
                                </View>
                            )}
                        </View>
                        <Pressable onPress={() =>  navigation.navigate("Timeline")}
                            style={{
                                height: 40,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                backgroundColor: themeColors.tint,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 40,

                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    color: themeColors.text,
                                    marginRight: 12
                                }}>View weekly timeline</Text>
                                <FontAwesome6 name='timeline'
                                    color={themeColors.text}
                                    size={14}/>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    )
}

export default MetricsBarChart