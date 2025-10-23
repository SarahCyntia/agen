import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";

export default function PaymentScreen({ route }: any) {
  const { orderId } = route.params;
  const [snapUrl, setSnapUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.get(`http://10.0.2.2:8000/payment/token/${orderId}`);
        if (!data.snap_token) {
          Alert.alert("Error", "Token tidak ditemukan");
          return;
        }
        setSnapUrl(`https://app.sandbox.midtrans.com/snap/v3/redirection/${data.snap_token}`);
      } catch (err) {
        Alert.alert("Error", "Gagal ambil token");
      }
    };

    fetchToken();
  }, [orderId]);

  if (!snapUrl) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <WebView source={{ uri: snapUrl }} style={{ flex: 1 }} />;
}
