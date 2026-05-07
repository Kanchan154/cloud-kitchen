import Background from '@/components/shared/Background'
import { AUTH_COLORS } from '@/constants'
import { useCartStore } from '@/store/cart.store'
import { CartItemType, IRestaurant, MenuItemsType } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, Pressable, Text, View } from 'react-native'

const Cart = () => {
  const [isFetching, setIsFetching] = useState(false);
  const { fetchCart, cartLenght, cartList, subTotal } = useCartStore();
  const firstCartItem = cartList[0];
  const restaurant =
    firstCartItem && typeof firstCartItem.restaurantId !== 'string'
      ? firstCartItem.restaurantId
      : null;

  const handleFetchCart = async () => {
    try {
      await fetchCart();
      setIsFetching(false);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  }

  const handleRefresh = async () => {
    setIsFetching(true);
    await handleFetchCart();
  }

  return (
    <Background>
      <FlatList
        data={cartList}
        keyExtractor={(item, index) => `${item.itemId}-${index}`}
        renderItem={({ item }) => <CartItemCard item={item} />}
        ListHeaderComponent={
          <HeaderCart
            Restaurant={restaurant}
            cartLength={cartLenght}
          />
        }
        ListFooterComponent={cartList.length > 0 ? <FooterCart subTotal={subTotal} restaurant={restaurant} /> : null}
        ListEmptyComponent={isFetching ? LoadingSection : EmptySection}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={handleRefresh}
      />
    </Background>
  )
}

interface CartItemCardProps {
  item: CartItemType;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
  const menuItem = typeof item.itemId === 'string' ? null : item.itemId as MenuItemsType;

  const { increamentItem, decreamentItem } = useCartStore();
  if (!menuItem) return null;

  return (
    <View
      className="mb-4 overflow-hidden border rounded-[20px] flex-row"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      {/* Item Image */}
      <Image
        source={{ uri: menuItem.image }}
        className="w-24 h-24"
        resizeMode="cover"
      />

      {/* Item Details */}
      <View className="justify-between flex-1 p-3">
        <View className='flex-row justify-between flex-1'>
          <View>
            <Text className="text-sm font-bold" style={{ color: AUTH_COLORS.textPrimary }} numberOfLines={1}>
              {menuItem.name}
            </Text>
            <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }} numberOfLines={2}>
              {menuItem.description}
            </Text>
          </View>
          <View className='pr-4'>
            <Text className="text-base font-bold" style={{ color: AUTH_COLORS.primary }}>
              ₹{item.quantity * item.itemId.price}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold" style={{ color: AUTH_COLORS.primary }}>
            ₹{menuItem.price}
          </Text>

          <View
            className="flex-row items-center gap-2 px-2 py-1 border rounded-lg"
            style={{
              backgroundColor: AUTH_COLORS.background,
              borderColor: AUTH_COLORS.cardBorder,
            }}
          >
            <Pressable className="p-1" onPress={() => decreamentItem(item.itemId._id)}>
              <MaterialCommunityIcons name="minus" size={14} color={AUTH_COLORS.textPrimary} />
            </Pressable>
            <Text className="w-6 text-xs font-semibold text-center" style={{ color: AUTH_COLORS.textPrimary }}>
              {item.quantity}
            </Text>
            <Pressable className="p-1" onPress={() => increamentItem(item.itemId._id)}>
              <MaterialCommunityIcons name="plus" size={14} color={AUTH_COLORS.textPrimary} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

type HeaderCartProps = {
  cartLength: number;
  Restaurant: IRestaurant | null
}

const HeaderCart = ({ cartLength, Restaurant }: HeaderCartProps) => {
  return (
    <View className="mb-5">
      <View
        className="px-4 py-4 mb-4 border rounded-[28px]"
        style={{
          backgroundColor: AUTH_COLORS.card,
          borderColor: AUTH_COLORS.cardBorder,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-xs font-semibold uppercase" style={{ color: AUTH_COLORS.textSubtle }}>
              Your cart
            </Text>
            <Text className="mt-2 text-2xl font-extrabold" style={{ color: AUTH_COLORS.textPrimary }}>
              {cartLength > 0 ? `Review your order from ${Restaurant?.name}` : 'Your cart is empty'}
            </Text>
            {cartLength > 0 && (
              <Text className="mt-2 text-xs leading-5" style={{ color: AUTH_COLORS.textSubtle }}>
                {Restaurant?.autoLocation.formattedAddress}
              </Text>
            )}
          </View>

          <View
            className="items-center justify-center w-16 h-16 border rounded-2xl"
            style={{
              backgroundColor: AUTH_COLORS.background,
              borderColor: AUTH_COLORS.cardBorder,
            }}
          >
            <MaterialCommunityIcons name="shopping" size={24} color={AUTH_COLORS.primary} />
          </View>
        </View>
      </View>

      {cartLength > 0 && (
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-sm font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
            Items in cart
          </Text>
          <View className="px-3 py-2 border rounded-full" style={{ backgroundColor: AUTH_COLORS.chip, borderColor: AUTH_COLORS.chipBorder }}>
            <Text className="text-xs font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
              {cartLength} item{cartLength !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

type FooterCartProps = {
  subTotal: number;
  restaurant: IRestaurant | null
}

const FooterCart = ({ subTotal, restaurant }: FooterCartProps) => {
  const safeSubTotal = Number(subTotal ?? 0)
  const deliveryFee = subTotal >= 500 ? 0 : 50
  const tax = safeSubTotal * 0.05
  const total = safeSubTotal + deliveryFee + tax

  const { clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const handleChackOut = () => {

  }
  const performClearCart = async () => {
    setIsLoading(true);
    try {
      await clearCart();
    } catch (error) {
      console.error('clearCart error:', error);
      Alert.alert('Error', 'Failed to clear cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          void performClearCart();
        },
      },
    ]);
  };
  return (
    <View className="mt-6">
      {/* Pricing Summary */}
      <View
        className="px-4 py-4 mb-4 border rounded-[20px]"
        style={{
          backgroundColor: AUTH_COLORS.card,
          borderColor: AUTH_COLORS.cardBorder,
        }}
      >
        <View className="mb-3">
          <View className="flex-row justify-between mb-2">
            <Text style={{ color: AUTH_COLORS.textSubtle }} className="text-sm">
              Subtotal
            </Text>
            <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-sm font-semibold">
              ₹{safeSubTotal.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text style={{ color: AUTH_COLORS.textSubtle }} className="text-sm">
              Delivery Fee
            </Text>
            <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-sm font-semibold">
              {`${deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}`}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text style={{ color: AUTH_COLORS.textSubtle }} className="text-sm">
              Taxes
            </Text>
            <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-sm font-semibold">
              ₹{tax.toFixed(2)}
            </Text>
          </View>
        </View>

        <View
          className="h-[1px] my-3"
          style={{ backgroundColor: AUTH_COLORS.cardBorder }}
        />

        <View className="flex-row items-center justify-between">
          <Text style={{ color: AUTH_COLORS.textPrimary }} className="text-lg font-bold">
            Total
          </Text>
          <Text style={{ color: AUTH_COLORS.primary }} className="text-2xl font-extrabold">
            ₹{total.toFixed(2)}
          </Text>
        </View>
        {
          deliveryFee !== 0 &&
          <Text style={{ color: AUTH_COLORS.primary }} className="text-sm font-semibold">
            {`Add item worth ₹${500 - subTotal} to get free delivery`}</Text>
        }
      </View>

      {/* Action Buttons */}
      <View className="gap-3">
        <Pressable
          disabled={!restaurant?.isOpen}
          className="flex-row items-center justify-center py-3 border rounded-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: AUTH_COLORS.primary,
            borderColor: AUTH_COLORS.primary,
          }}
        >
          <MaterialCommunityIcons name="card-multiple" size={18} color="white" />
          <Text className="ml-2 text-base font-bold text-white">
            {!restaurant?.isOpen ? "Restaurant is closed" : "Proceed to Checkout"}
          </Text>
        </Pressable>

        <Pressable
          className="flex-row items-center justify-center py-3 border rounded-[16px]"
          style={{
            backgroundColor: AUTH_COLORS.background,
            borderColor: AUTH_COLORS.cardBorder,
          }}
          onPress={handleClearCart}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator size="small" color={AUTH_COLORS.primary} /> :
            <>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={AUTH_COLORS.textPrimary} />
              <Text className="ml-2 text-base font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
                Clear Cart
              </Text>
            </>
          }
        </Pressable>
      </View>
    </View>
  )
}

const LoadingSection = () => {
  return (
    <View
      className="items-center justify-center px-5 py-10 border rounded-3xl"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      <ActivityIndicator size="small" color={AUTH_COLORS.primary} />
      <Text className="mt-3 text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
        Loading cart...
      </Text>
      <Text className="mt-1 text-xs text-center" style={{ color: AUTH_COLORS.textSubtle }}>
        Fetching your cart items.
      </Text>
    </View>
  )
}

const EmptySection = () => {
  return (
    <View
      className="items-center justify-center px-5 py-10 border rounded-3xl"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      <MaterialCommunityIcons name="shopping-outline" size={34} color={AUTH_COLORS.textSubtle} />
      <Text className="mt-3 text-base font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
        Cart is empty
      </Text>
      <Text className="mt-1 text-xs text-center" style={{ color: AUTH_COLORS.textSubtle }}>
        Start adding items from restaurants to fill your cart.
      </Text>
    </View>
  )
}

export default Cart