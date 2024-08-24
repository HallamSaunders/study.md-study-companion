import * as FileSystem from 'expo-file-system';

import { notesDirectory } from './filesystem-operations';

export const saveNote = async (filename: string, content: string) => {
    const fileUri = `${notesDirectory}${filename}.md`;
    try {
        await FileSystem.writeAsStringAsync(fileUri, content);
    } catch (error) {
        console.error("Error writing file: ", error);
    }
};

export const readNote = async (filename: string) => {
    const fileUri = `${notesDirectory}${filename}.md`;
    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return content;
    } catch (error) {
        console.error("Error reading file: ", error);
        return null;
    }
};

export async function fetchFiles(): Promise<string[]> {
    try {
        //Check if the directory exists
        const dirInfo = await FileSystem.getInfoAsync(notesDirectory);
        if (!dirInfo.exists) {
            //Create the directory if it doesn't exist
            await FileSystem.makeDirectoryAsync(notesDirectory, { intermediates: true });
        }

        //Read the directory content
        const fetchedFiles = await FileSystem.readDirectoryAsync(notesDirectory);
        if (fetchedFiles != null) {
            return fetchedFiles;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching files: ", error);
        return [];
    }
}