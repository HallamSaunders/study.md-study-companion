import * as SQLite from 'expo-sqlite';

async function initializeDatabase() {
    const db = await SQLite.openDatabaseAsync('notesDatabase');
    setupDatabase(db);
}

initializeDatabase();

//Set up notes database 
const setupDatabase = (db: SQLite.SQLiteDatabase) => {
    
}
