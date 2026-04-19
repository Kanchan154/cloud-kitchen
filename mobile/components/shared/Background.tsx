import { View, Text } from 'react-native'
import React from 'react'
import { AUTH_COLORS } from '@/constants'

const Background = ({ children }: { children: React.ReactNode }) => {
    return (
        <View
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
        </View>
    )
}

export default Background