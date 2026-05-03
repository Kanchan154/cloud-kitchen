import { View, Text } from 'react-native'
import React from 'react'
import Header from '@/components/customer/Header'
import { useAuthStore } from '@/store/auth.store'
import Background from '@/components/shared/Background'

const Cart = () => {
    const {city} = useAuthStore();
  return (
    <Background>
      <View className='p-4'></View>
        <Header/>
      <Text>{city}</Text>
    </Background>
  )
}

export default Cart