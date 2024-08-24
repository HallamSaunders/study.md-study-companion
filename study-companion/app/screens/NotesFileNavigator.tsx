import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';

//FileSystem imports
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Markdown from 'react-native-markdown-display';
import { StorageAccessFramework } from 'expo-file-system';

interface Note {
  name: string;
  content: string;
}

const NotesTab: React.FC = () => {
  const [directory, setDirectory] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (directory) {
      loadNotes();
    }
  }, [directory]);

  const pickDirectory = async () => {
  };

  const loadNotes = async () => {
    if (!directory) return;

    try {
      const files = await FileSystem.readDirectoryAsync(directory);
      const loadedNotes = await Promise.all(
        files
          .filter((file) => file.endsWith('.md'))
          .map(async (file) => {
            const content = await FileSystem.readAsStringAsync(`${directory}/${file}`);
            return { name: file, content };
          })
      );
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const createNote = async () => {
    if (!directory) return;

    const newNoteName = `note_${Date.now()}.md`;
    const newNoteContent = '# New Note\n\nStart writing here...';

    try {
      await FileSystem.writeAsStringAsync(`${directory}/${newNoteName}`, newNoteContent);
      setNotes([...notes, { name: newNoteName, content: newNoteContent }]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const saveNote = async () => {
    if (!directory || !selectedNote) return;

    try {
      await FileSystem.writeAsStringAsync(`${directory}/${selectedNote.name}`, selectedNote.content);
      setEditMode(false);
      loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <Button title={item.name} onPress={() => setSelectedNote(item)} />
  );

  return (
    <View style={{ flex: 1 }}>
      {!directory && (
        <Button title="Pick a directory to store notes" onPress={pickDirectory} />
      )}
      {directory && (
        <>
          <Button title="Create New Note" onPress={createNote} />
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.name}
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
        </>
      )}
    </View>
  );
};

export default NotesTab;