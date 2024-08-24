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

export const listNotes = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(notesDirectory);
      return files.filter(file => file.endsWith('.md'));
    } catch (error) {
      console.error("Error listing files: ", error);
      return [];
    }
};