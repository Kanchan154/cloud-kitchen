import AddRestaurantDialogBox from '@/components/seller/AddRestaurantDialogBox'
import MyRestraunt from '@/components/seller/MyRestraunt'
import LoadingSection from '@/components/shared/LoadingSection'
import { useSellerStore } from '@/store/seller.store'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
    const { getMyRestaurant, myRestaurant, isFetching } = useSellerStore();

    useEffect(() => {
        getMyRestaurant();
    }, [getMyRestaurant])

    if (isFetching) return <LoadingSection />

    return (
        <SafeAreaView className="flex-1">
            <AddRestaurantDialogBox
                visible={!myRestaurant}
                onClose={() => { }}
            />

            {myRestaurant && (
                <MyRestraunt restaurant={myRestaurant} />
            )}
        </SafeAreaView>
    )
}

export default Home