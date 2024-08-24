import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Markdown from 'react-native-markdown-display';

interface Note {
  name: string;
  content: string;
}

const NotesTab: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [notesDirectory, setNotesDirectory] = useState<string | null>(null);

  useEffect(() => {
    setupNotesDirectory();
  }, []);

  useEffect(() => {
    if (notesDirectory) {
      loadNotes();
    }
  }, [notesDirectory]);

  const setupNotesDirectory = async () => {
    const dir = `${FileSystem.documentDirectory}notes/`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    setNotesDirectory(dir);
  };

  const loadNotes = async () => {
    if (!notesDirectory) return;

    try {
      const files = await FileSystem.readDirectoryAsync(notesDirectory);
      const loadedNotes = await Promise.all(
        files
          .filter((file) => file.endsWith('.md'))
          .map(async (file) => {
            const content = await FileSystem.readAsStringAsync(`${notesDirectory}${file}`);
            return { name: file, content };
          })
      );
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      Alert.alert('Error', 'Failed to load notes.');
    }
  };

  const createNote = async () => {
    if (!notesDirectory) return;

    const newNoteName = `note_${Date.now()}.md`;
    const newNoteContent = '# New Note\n\nStart writing here...';

    try {
      await FileSystem.writeAsStringAsync(`${notesDirectory}${newNoteName}`, newNoteContent);
      setNotes([...notes, { name: newNoteName, content: newNoteContent }]);
    } catch (error) {
      console.error('Error creating note:', error);
      Alert.alert('Error', 'Failed to create note.');
    }
  };

  const saveNote = async () => {
    if (!notesDirectory || !selectedNote) return;

    try {
      await FileSystem.writeAsStringAsync(`${notesDirectory}${selectedNote.name}`, selectedNote.content);
      setEditMode(false);
      loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note.');
    }
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <Button title={item.name} onPress={() => setSelectedNote(item)} />
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Create New Note" onPress={createNote} />
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.name}
        style={{ marginVertical: 10 }}
      />
      {selectedNote && (
        <View style={{ flex: 1 }}>
          {editMode ? (
            <>
              <TextInput
                multiline
                value={selectedNote.content}
                onChangeText={(text) => setSelectedNote({ ...selectedNote, content: text })}
                style={{ flex: 1, borderWidth: 1, padding: 10 }}
              />
              <Button title="Save" onPress={saveNote} />
            </>
          ) : (
            <>
              <Markdown>{selectedNote.content}</Markdown>
              <Button title="Edit" onPress={() => setEditMode(true)} />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default NotesTab;