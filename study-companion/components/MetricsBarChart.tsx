import { View, Text } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit'

//Firestore and database
import { getLastSevenDaysSessionTotals } from '../firebase/metricsQuerying';

const MetricsBarChart = () => {
    getLastSevenDaysSessionTotals().then((totals) => {
        console.log("Totals for past 7 days: ", totals);
    })
    
    return (
        <View>
            <Text>MetricsBarChart</Text>
            {/*<LineChart
                data={{

                }} />*/}
        </View>
  )
}

export default MetricsBarChart