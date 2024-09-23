import { View, Text, Pressable, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'

//Color schemes and insets
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const Skills = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>('');

  //Spacing
  const insets = useSafeAreaInsets();

  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  //Handle adding skill
  const addSkill = () => {
    if (newSkill === '') return;
    setSkills([...skills, newSkill]);
    setNewSkill('');
  }

  const deleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  }

  return (
    <ScrollView style={{
      backgroundColor: themeColors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      height: "100%",
      width: "100%",
    }}>
      <View style={{
        margin: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
      }}>
          <Text style={{
            fontSize: 20,
            color: themeColors.text
          }}>Your Skills</Text>
          {/*<Pressable onPress={() => addSkill()}
              style={{
                  justifyContent: 'flex-end'
              }}>
              <Feather name='plus' size={18} color={themeColors.text}/>
          </Pressable>*/}
      </View>
      <View style={{
        flex: 1,
        height: '100%',
        justifyContent: 'flex-start',

      }}>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          marginLeft: 12,
          marginRight: 12,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: themeColors.border,
            borderWidth: 1,
            borderRadius: 8,
            padding: 5,
            marginBottom: 12,
          }}>
            <TextInput style={{
              fontSize: 14,
              color: themeColors.text,
            }} 
              placeholder='Add a new skill'
              placeholderTextColor={themeColors.subtleText}
              onChangeText={(text) => setNewSkill(text)}
              value={newSkill}
            />
            <Pressable onPress={() => addSkill()}
                style={{
                  justifyContent: 'flex-end'
                }}>
                <Feather name='plus' size={18} color={themeColors.text}/>
            </Pressable>
          </View>
          {skills.map((skill, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 5,
            }}>
              <Text style={{
                fontSize: 14,
                color: themeColors.text,
              }}>{skill}</Text>
              <Pressable onPress={() => deleteSkill(index)}
                  style={{
                    justifyContent: 'flex-end'
                  }}>
                  <Feather name='trash-2' size={18} color={themeColors.text}/>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default Skills