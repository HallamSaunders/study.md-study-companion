import * as FileSystem from 'expo-file-system';

//Define base directory for notes
const notesDirectory = `${FileSystem.documentDirectory}notes/`;

//Create notes directory if it doesn't exist
const createNotesDirectory = async () => {
    const dirInfo = await FileSystem.getInfoAsync(notesDirectory);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(notesDirectory, { intermediates: true });
    }
};

//Call function during app initialization
createNotesDirectory();