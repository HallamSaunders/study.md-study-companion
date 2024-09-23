import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'

//Color schemes and insets
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const Skills = () => {
  const [skills, setSkills] = useState<string[]>([]);

  //Spacing
  const insets = useSafeAreaInsets();

  //Color schemes
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  //Handle adding skill
  const addSkill = () => {
    setSkills([...skills, 'Skill']);
  }

  return (
    <View style={{
      backgroundColor: themeColors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      height: "100%",
      width: "100%",
    }}>
      <ScrollView>
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
            <Pressable onPress={() => addSkill()}
                style={{
                    justifyContent: 'flex-end'
                }}>
                <Feather name='plus' size={18} color={themeColors.text}/>
            </Pressable>
        </View>
        <View style={{
          flex: 1,
          height: '100%',
          justifyContent: 'flex-start',

        }}>
          <View style={{
            width: '75%',
            alignItems: 'center',
            //borderWidth: 2,
            //borderColor: 'red'
          }}>
            {skills.map((skill, index) => (
              <Text key={index} style={{
                fontSize: 14,
                color: themeColors.text,
                marginBottom: 8,
              }}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Skills