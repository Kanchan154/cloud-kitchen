import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="text-red-500">
        Edit app/index.tsx to edit this screen.
      </Text>
      <TouchableOpacity className="p-2 bg-red-500 rounded-lg" onPress={() => router.push('/(auth)')}>
        <Text className="p-2 text-white">Press me</Text>
      </TouchableOpacity>
    </View>
  );
}
