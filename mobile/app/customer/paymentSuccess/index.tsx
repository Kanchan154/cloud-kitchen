import Background from '@/components/shared/Background';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Share, Text, TouchableOpacity, View } from 'react-native';

const PayemntSuccess = () => {
  const { paymentId, amount } = useLocalSearchParams();
  const router = useRouter();

  const handleNavigateToOrders = () => {
    router.push('/customer/orders');
  };

  const handleShareReceipt = async () => {
    try {
      await Share.share({
        message: `Payment Successful!\n\nPayment ID: ${paymentId}\n\nThank you for your order!`,
        title: 'Payment Receipt',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  return (
    <Background>
      <View className="items-center justify-center flex-1 px-6">
        {/* Success Icon/Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-center text-green-600">✓</Text>
          <Text className="mt-4 text-2xl font-bold text-center text-gray-800">
            Payment Successful!
          </Text>
        </View>

        {/* Payment ID Section */}
        <View className="w-full p-6 mb-8 bg-white rounded-lg shadow-sm">
          <Text className='mb-1 text-4xl font-bold text-center' style={{ color: 'green' }}>₹{amount}</Text>
          <Text className="mb-2 text-center text-gray-600">Payment ID</Text>
          <Text className="text-xl font-bold text-center text-gray-800 break-words">
            {paymentId || 'N/A'}
          </Text>
        </View>

        {/* Message */}
        <Text className="mb-8 text-center text-gray-600">
          Your order has been placed successfully. You can track it in your orders.
        </Text>

        {/* Buttons */}
        <View className="w-full gap-4">
          {/* View Orders Button */}
          <TouchableOpacity
            onPress={handleNavigateToOrders}
            className="items-center px-6 py-4 bg-yellow-500 rounded-lg"
          >
            <Text className="text-lg font-bold text-white">View Orders</Text>
          </TouchableOpacity>

          {/* Share Receipt Button */}
          <TouchableOpacity
            onPress={handleShareReceipt}
            className="items-center px-6 py-4 bg-gray-200 rounded-lg"
          >
            <Text className="text-lg font-bold text-gray-800">Share Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  )
}

export default PayemntSuccess