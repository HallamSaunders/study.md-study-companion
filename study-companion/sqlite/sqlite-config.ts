import * as SQLite from 'expo-sqlite';

//Define the Session type
interface Session {
  id?: number;
  blocks: number;
  time: number;
  timestamp: string;
  type: string;
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
        await this.insertTestData();
    }

    // Create the sessions table if it doesn't exist
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
}

//Export the singleton instance
export const sqliteManager = SQLiteManager.getInstance();