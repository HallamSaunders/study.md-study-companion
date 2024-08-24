import * as SQLite from 'expo-sqlite';

async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('notesDatabase');
  // Additional database initialization code here
}

initializeDatabase();
