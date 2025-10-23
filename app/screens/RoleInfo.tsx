import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";

export default function RoleInfo() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // nanti kita ganti "ISI_TOKEN_KAMU" dengan token login asli
    const fetchRole = async () => {
      const token = "ISI_TOKEN_KAMU"; // nanti ganti dinamis dari AsyncStorage

      try {
        const res = await axios.get("/api/user/role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRole(res.data.role);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>
        Role kamu sekarang:{" "}
        <Text style={{ fontWeight: "bold" }}>{role}</Text>
      </Text>
    </View>
  );
}
