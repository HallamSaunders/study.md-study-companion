import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = await SQLite.openDatabaseAsync('userdata');

/*interface Session {
    id?: number;
    blocks: number;
    time: number;
    timestamp: number; //Store as Unix timestamp
    type: string;
}

class DatabaseManager {
    const DATABASE_NAME = 'userdata';    
    
    private db: SQLite.SQLiteDatabase;

    constructor() {
        this.db = SQLite.openDatabaseSync(DATABASE_NAME);
        this.init();
    }

    private init() {
        this.db.execAsync(
            `CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                blocks INTEGER,
                time INTEGER,
                timestamp INTEGER,
                type TEXT
            );`
        )
    }

    public addSession(session: Omit<Session, 'id'>): Promise<number> {

    }
}

export const dbManager = new DatabaseManager();*/

