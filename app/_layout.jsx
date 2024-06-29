import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Start from './start'
const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="start"  />
    </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})