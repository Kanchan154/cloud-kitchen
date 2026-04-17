import AddRestaurantDialogBox from '@/components/seller/AddRestaurantDialogBox'
import MyRestraunt from '@/components/seller/MyRestraunt'
import LoadingSection from '@/components/shared/LoadingSection'
import { useSellerStore } from '@/store/seller.store'
import React, { useEffect } from 'react'

const Home = () => {
    const { getMyRestaurant, myRestaurant, isFetching } = useSellerStore();

    useEffect(() => {
        getMyRestaurant();
    }, [getMyRestaurant])

    if (isFetching) return <LoadingSection />

    return (
        <>
            <AddRestaurantDialogBox
                visible={!myRestaurant}
            />

            {myRestaurant && (
                <MyRestraunt restaurant={myRestaurant} />
            )}
        </>
    )
}

export default Home