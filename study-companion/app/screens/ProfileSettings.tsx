import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

//Firebase auth
import { FIREBASE_AUTH } from '../../firebase/firebase-config'

export default function ProfileSettings() {
  return (
    <View>
      <Text>ProfileSettings</Text>
      <Pressable onPress={() => FIREBASE_AUTH.signOut()}
        style={{
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignItems: 'center',
            marginBottom: 10,
            backgroundColor: 'transparent',
            borderColor: '#ff0000',
            borderWidth: 1,
          }}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({})