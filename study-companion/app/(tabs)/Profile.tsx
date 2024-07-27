import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

//Firebase auth
import { FIREBASE_AUTH } from '../../firebase/firebase-config'

export default function Profile() {
  return (
    <View>
      <Text>profile</Text>
      <Pressable onPress={() => FIREBASE_AUTH.signOut}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({})