import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    };
    doLogout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#ff3b30" />
      <Text>Sedang logout...</Text>
    </View>
  );
}
