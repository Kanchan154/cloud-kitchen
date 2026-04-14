import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TablayoutRider = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  )
}

export default TablayoutRider