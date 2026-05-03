import { AUTH_COLORS } from '@/constants'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Background = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: AUTH_COLORS.background }}
        >
            <View
                className="absolute"
                style={{
                    width: 260,
                    height: 260,
                    borderRadius: 130,
                    backgroundColor: AUTH_COLORS.accent,
                    opacity: 0.16,
                    top: -80,
                    right: -60,
                }}
            />
            <View
                className="absolute"
                style={{
                    width: 320,
                    height: 320,
                    borderRadius: 160,
                    backgroundColor: AUTH_COLORS.primary,
                    opacity: 0.12,
                    bottom: -130,
                    left: -90,
                }}
            />
            {children}
        </SafeAreaView>
    )
}

export default Background