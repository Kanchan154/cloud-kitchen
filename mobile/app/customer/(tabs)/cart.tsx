import { View, Text } from 'react-native'
import React from 'react'
import Header from '@/components/customer/Header'
import { useAuthStore } from '@/store/auth.store'

const Cart = () => {
    const {city} = useAuthStore();
  return (
    <View>
        <Header/>
      <Text>{city}</Text>
    </View>
  )
}

export default Cart