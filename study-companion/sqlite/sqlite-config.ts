import * as SQLite from 'expo-sqlite';

//Define the WeeklyDataItem type
export interface WeeklyDataItem {
    date: string;
    time: number;
}

class SQLiteManager {
    private static instance: SQLiteManager;
    private db: SQLite.SQLiteDatabase | null = null;

    private constructor() {
        this.init();
    }

    //Get the singleton instance
    public static getInstance(): SQLiteManager {
        if (!SQLiteManager.instance) {
            SQLiteManager.instance = new SQLiteManager();
        }
        return SQLiteManager.instance;
    }

    //Initialize and open the database
    private async init() {
        this.db = await SQLite.openDatabaseAsync('sessions.db');
        await this.createSessionsTable();
        //await this.insertTestData();
    }

    //Create the sessions table if it doesn't exist
    private async createSessionsTable() {
        if (!this.db) return;

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time INTEGER,
                blocks INTEGER,
                timestamp TEXT,
                type TEXT
            );
        `);
    }
    
    public async insertTestData() {
        if (!this.db) return;

        const testData = [
            { time: 1800, blocks: 3, timestamp: '2023-06-01T10:00:00', type: 'pomodoro' },
            { time: 1200, blocks: 0, timestamp: '2023-06-02T14:30:00', type: 'timer' },
            { time: 3600, blocks: 6, timestamp: '2023-06-03T09:15:00', type: 'pomodoro' },
        ];

        for (const data of testData) {
            await this.insertSession(data.time, data.blocks, data.timestamp, data.type);
        }

        console.log('Test data inserted successfully');
    }

    //Insert a session record
    public async insertSession(
        time: number,
        blocks: number,
        timestamp: string,
        type: string
    ) {
        if (!this.db) return;
        await this.db.runAsync(
            `INSERT INTO sessions (time, blocks, timestamp, type) VALUES (?, ?, ?, ?)`,
            [time, blocks, timestamp, type]
        );
    }

    //Retrieve all session records
    public async getSessions() {
        if (!this.db) return [];
        const allRows = await this.db.getAllAsync("SELECT * FROM sessions");
        return allRows;
    }

    //Retrieve all session records from previous 7 days
    public async getSessionsPastWeek() {
        if (!this.db) return [];

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoTimestamp = sevenDaysAgo.toISOString();

        const query = `
            SELECT * FROM sessions 
            WHERE timestamp >= ? 
            ORDER BY timestamp DESC
        `;

        try {
            const result = await this.db.getAllAsync(query, [sevenDaysAgoTimestamp]);
            return result;
        } catch (error) {
            console.error('Error fetching sessions from past week:', error);
            return [];
        }
    }

    //Process the data from getSessionsPastWeek
    public processWeeklyData(sessions: any[]): WeeklyDataItem[] {
        //Get the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); //-6 because we want to include today
        sevenDaysAgo.setHours(0, 0, 0, 0); // Set to start of day

        //Initialize an object to hold data for all 7 days
        const allDaysData: { [key: string]: { time: number; blocks: number; } } = {};
        
        //Set time and blocks initial values to 0 for every day
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            allDaysData[this.formatDate(date)] = { time: 0, blocks: 0};
        }

        //Process sessions
        sessions.forEach(session => {
            const date = new Date(session.timestamp);
            const dayKey = this.formatDate(date);
            const time = session.time || 0;
            const blocks = session.blocks || 0;

            //Update session time and blocks count
            if (allDaysData.hasOwnProperty(dayKey)) {
                allDaysData[dayKey].time += time;
                allDaysData[dayKey].blocks += blocks;
            }
        });

        //Convert to required format
        return Object.entries(allDaysData).map(([date, { time, blocks }]) => ({
            date,
            time,
            blocks
        }));
    }

    private formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        //return `${day}/${month}`;
        return day;
    }
}

//Export the singleton instance
export const sqliteManager = SQLiteManager.getInstance();