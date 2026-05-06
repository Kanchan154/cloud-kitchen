import AddMenuItemDialogBox from '@/components/seller/AddMenuItemDialogBox';
import MenuItemCard from '@/components/seller/MenuItemCard';
import Background from '@/components/shared/Background';
import { AUTH_COLORS } from '@/constants';
import { useSellerStore } from '@/store/seller.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

const menu = () => {
  const { menuItemList, getAllMenuItems, isFetching } = useSellerStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    getAllMenuItems();
  }, [getAllMenuItems]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getAllMenuItems();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCloseDialog = () => {
    setIsVisible(false);
    getAllMenuItems();
  };

  return (
    <Background>
      <FlatList
        data={menuItemList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <MenuItemCard item={item} />}
        ListHeaderComponent={() => HeaderSection({ setIsVisible })}
        ListEmptyComponent={isFetching ? LoadingSection : EmptySection}
        contentContainerStyle={{ paddingHorizontal: 24,  paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={AUTH_COLORS.primary}
          />
        }
      />
      <AddMenuItemDialogBox visible={isVisible} onClose={handleCloseDialog} />
    </Background>
  );
};

const LoadingSection = () => {
  return (
    <View
      className="items-center justify-center py-10 border rounded-2xl"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      <Text className="text-sm font-semibold" style={{ color: AUTH_COLORS.textPrimary }}>
        Loading menu items...
      </Text>
    </View>
  )
}

const EmptySection = () => {
  return (
    <View
      className="items-center justify-center px-5 py-10 border rounded-2xl"
      style={{
        backgroundColor: AUTH_COLORS.card,
        borderColor: AUTH_COLORS.cardBorder,
      }}
    >
      <MaterialCommunityIcons name="silverware-fork-knife" size={32} color={AUTH_COLORS.textSubtle} />
      <Text className="mt-3 text-base font-bold" style={{ color: AUTH_COLORS.textPrimary }}>
        No menu items yet
      </Text>
      <Text className="mt-1 text-xs text-center" style={{ color: AUTH_COLORS.textSubtle }}>
        Add your first menu item to start receiving food orders.
      </Text>
    </View>
  )
}

const HeaderSection = ({ setIsVisible }: { setIsVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <>
      <Pressable
        className="flex-row items-center justify-center px-4 py-4 mb-5 border rounded-2xl"
        style={{
          backgroundColor: AUTH_COLORS.primary,
          borderColor: AUTH_COLORS.primary,
        }}
        onPress={() => setIsVisible(true)}
      >
        <MaterialCommunityIcons name="plus-circle" size={18} color={AUTH_COLORS.background} />
        <Text className="ml-2 text-sm font-extrabold" style={{ color: AUTH_COLORS.background }}>
          Add Menu Item
        </Text>
      </Pressable>

      <View className="mb-3">
        <Text className="text-xl font-extrabold" style={{ color: AUTH_COLORS.textPrimary }}>
          Your Menu
        </Text>
        <Text className="mt-1 text-xs" style={{ color: AUTH_COLORS.textSubtle }}>
          Manage availability and remove items quickly.
        </Text>
      </View>
    </>
  )
}



export default menu;