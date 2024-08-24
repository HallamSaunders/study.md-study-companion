import * as FileSystem from 'expo-file-system';

//Define base directory for notes
export const notesDirectory = `${FileSystem.documentDirectory}notes/`;

//Create notes directory if it doesn't exist
export const createNotesDirectory = async () => {
    const dirInfo = await FileSystem.getInfoAsync(notesDirectory);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(notesDirectory, { intermediates: true });
    }
    console.log("Notes Directory: ", notesDirectory);
};

//Call function during app initialization
//createNotesDirectory();

//console.log("Notes Directory: ", notesDirectory);