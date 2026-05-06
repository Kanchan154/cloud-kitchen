import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { AUTH_COLORS } from '@/constants'

const TablayoutRider = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AUTH_COLORS.primary,
        tabBarInactiveTintColor: AUTH_COLORS.textSubtle,
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  )
}

export default TablayoutRider