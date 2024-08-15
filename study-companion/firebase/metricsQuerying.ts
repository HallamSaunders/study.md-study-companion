import { collection, Firestore, getDocs, query, Timestamp, where } from "firebase/firestore";
import { getUserDocID } from "./databaseCalls";
import { FIRESTORE_DB } from "./firebase-config";
import { useState } from "react";

interface SessionData {
    time: number;
    blocks: number;
    timestamp: Timestamp;
    type: string;
}

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

//Get daily totals from last 7 days
export async function getLastSevenDaysSessionTotals(): Promise<weeklyData> {
    let dailyTotalsArray: DailyTotal[] = [];
    
    console.log("Firestore called from getLastSevenDaysSessionTotals()");
    
    //Necessary references
    const userDocId = await getUserDocID();
    const db: Firestore = FIRESTORE_DB;

    const sessionsRef = collection(db, `users/${userDocId}/sessions`);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    //Query all sessions from the past 7 days
    const q = query(
        sessionsRef,
        where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo))
    );
    const querySnapshot = await getDocs(q);
    
    const dailyTotals: { [date: string]: DailyTotal } = {};

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        //Initialise time and sessions to 0
        dailyTotals[dateString] = {
            time: 0,
            blocks: 0,
            date: Timestamp.fromDate(new Date(dateString))
        };
    }

    //Aggregate time for each day
    querySnapshot.forEach((doc) => {
        const sessionData = doc.data() as SessionData;
        const dateString = sessionData.timestamp.toDate().toISOString().split('T')[0];

        if (dailyTotals[dateString]) {
            dailyTotals[dateString].time += sessionData.time;
            dailyTotals[dateString].blocks += sessionData.blocks;
        }
    });

    //Convert the object to an array and sort by date
    dailyTotalsArray = (Object.values(dailyTotals).sort((a, b) => a.date.seconds - b.date.seconds));

    //Calculate daily average study time
    let weeklyTotal: number = 0;
    dailyTotalsArray.forEach((total: DailyTotal) => {
        weeklyTotal += total.time;
    });

    let weeklyTotalBlocks: number = 0;
    dailyTotalsArray.forEach((total: DailyTotal) => {
        weeklyTotalBlocks += total.blocks;
    });

    console.log("Weekly total: ", weeklyTotal, "; weekly total blocks: ", weeklyTotalBlocks);

    const weeklyDataReturn: weeklyData = {
        dailyTotals: Object.values(dailyTotals).sort((a, b) => a.date.seconds - b.date.seconds),
        weeklyAverage: (weeklyTotal / 7),
        totalBlocks: weeklyTotalBlocks,
        avgTimePerBlock: (weeklyTotalBlocks > 0) ? (weeklyTotal / weeklyTotalBlocks) : 0
    }

    return weeklyDataReturn;
}