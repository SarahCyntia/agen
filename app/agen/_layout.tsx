// app/_layout.tsx
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";

export default function Layout() {
  const [userRole, setUserRole] = useState("pengguna");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Loading user data...");
        const userData = await AsyncStorage.getItem("user");

        console.log("User data from storage:", userData);
        if (userData) {
          const user = JSON.parse(userData);
          console.log("Parsed user data:", user);

          let roleName = "pengguna";
          if (typeof user.role === "string") {
            roleName = user.role;
          } else if (Array.isArray(user.role) && user.role.length > 0) {
            roleName = user.role[0]?.name ?? "pengguna";
          } else if (typeof user.role === "object" && user.role.name) {
            roleName = user.role.name;
          }

          console.log("Determined role name:", roleName);
          setUserName(user?.name || "User");
          setUserRole(roleName);
        }
      } catch (err) {
        console.log("Gagal ambil user:", err);
      }
    };

    loadUser();
  }, []);

  const LayoutContent = <Stack screenOptions={{ headerShown: false }} />;

  // Supaya tidak error di web (karena react-native-alert-notification tidak support web)
  if (Platform.OS !== "web") {
    return <AlertNotificationRoot>{LayoutContent}</AlertNotificationRoot>;
  }

  return LayoutContent;
}



// app/_layout.tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Stack } from "expo-router";
// import { useEffect, useState } from "react";
// import { AlertNotificationRoot } from "react-native-alert-notification";
// // import { Stack } from "expo-router";
// export default function Layout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

// const [userRole, setUserRole] = useState("pengguna");
// useEffect(() => {
//     const loadUser = async () => {
//       try {
//         console.log("Loading user data...");
//         const userData = await AsyncStorage.getItem("user");

//         console.log("User data from storage:", userData);
//         if (userData) {
//           const user = JSON.parse(userData);
//           console.log("Parsed user data:", user);

//           // handle kemungkinan role berupa object atau array
//           let roleName = "pengguna";
//           if (typeof user.role === "string") {
//             console.log("Role is a string:", user.role);
//             roleName = user.role;
//           } else if (Array.isArray(user.role) && user.role.length > 0) {
//             console.log("Role is an array:", user.role);
//             roleName = user.role[0]?.name ?? "pengguna";
//           } else if (typeof user.role === "object" && user.role.name) {
//             console.log("Role is an object:", user.role);
//             roleName = user.role.name;
//           }
//           console.log("Determined role name:", roleName);

//           setUserName(user?.name || "User");
//           setUserRole(roleName);
//         }
//       } catch (err) {
//         console.log("Gagal ambil user:", err);
//       }
//     };
//     loadUser();
//   }, []);
  
// import React, { useEffect, useState } from "react";
// import { Stack, Redirect } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ActivityIndicator, View } from "react-native";

// export default function RootLayout() {
//   const [role, setRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem("user");
//         if (storedUser) {
//           const user = JSON.parse(storedUser);
//           let roleName = "pengguna";

//           if (typeof user.role === "string") roleName = user.role;
//           else if (Array.isArray(user.role)) roleName = user.role[0]?.name ?? "pengguna";
//           else if (typeof user.role === "object" && user.role?.name) roleName = user.role.name;

//           setRole(roleName);
//         } else {
//           setRole(null);
//         }
//       } catch (error) {
//         console.log("Gagal ambil user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUser();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // 🔹 Arahkan otomatis berdasarkan role
//   if (!role) return <Redirect href="/auth/login" />;
//   if (role === "admin") return <Redirect href="/admin" />;
//   if (role === "kurir") return <Redirect href="/kurir" />;
//   if (role === "pengguna") return <Redirect href="/home" />;

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {/* fallback route jika tidak ada */}
//     </Stack>
//   );
// }
