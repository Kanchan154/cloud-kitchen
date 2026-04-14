import { Tabs } from 'expo-router'
import React from 'react'

const TabLayoutCustomer = () => {
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  )
}

export default TabLayoutCustomer