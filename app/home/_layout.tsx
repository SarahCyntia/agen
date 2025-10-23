// app/_layout.tsx
// import { Stack } from "expo-router";

// export default function Layout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        drawerStyle: {
          backgroundColor: "#111",
          width: 240,
        },
        drawerLabelStyle: {
          color: "#fff",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ title: "🏠 Dashboard" }}
      />
      <Drawer.Screen
        name="/admin/admin"
        options={{ title: "🏠 Dashboard Admin" }}
      />
      {/* <Drawer.Screen
        name="dashboard"
        options={{ title: "🏠 Dashboard" }}
      /> */}
      <Drawer.Screen
        name="data-order"
        options={{ title: "📋 Data Order" }}
      />
      <Drawer.Screen
        name="input-order"
        options={{ title: "➕ Input Order" }}
      />
      <Drawer.Screen
        name="logout"
        options={{ title: "🚪 Logout" }}
      />

      {/* ❌ Sembunyikan routes yang nggak perlu */}
      {/* <Drawer.Screen name="index" options={{ drawerItemStyle: { display: "none" } }} /> */}
      <Drawer.Screen name="halo" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="ganti" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="login" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="home/index" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="admin/index" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="logout" options={{ title: "🚪 Logout" }} />
    </Drawer>
  );
}

// import React from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { NavigationContainer } from "@react-navigation/native";
// import Dashboard from "./dashboard";
// import DataOrder from "./order/data-order";
// import InputOrder from "./order/input-order";
// import LogoutScreen from "./logout";

// const Drawer = createDrawerNavigator();

// export default function RootLayout() {
//   return (
//     <NavigationContainer independent={true}>
//       <Drawer.Navigator
//         initialRouteName="Dashboard"
//         screenOptions={{
//           headerShown: true,
//           drawerType: "front",
//           drawerStyle: {
//             backgroundColor: "#111", // sidebar warna hitam
//             width: 240,
//           },
//           drawerLabelStyle: {
//             color: "#fff",
//           },
//         }}
//       >
//         <Drawer.Screen
//           name="Dashboard"
//           component={Dashboard}
//           options={{ title: "🏠 Dashboard" }}
//         />
//         <Drawer.Screen
//           name="DataOrder"
//           component={DataOrder}
//           options={{ title: "📋 Data Order" }}
//         />
//         <Drawer.Screen
//           name="InputOrder"
//           component={InputOrder}
//           options={{ title: "➕ Input Order" }}
//         />
//         <Drawer.Screen
//           name="Logout"
//           component={LogoutScreen}
//           options={{ title: "🚪 Logout" }}
//         />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// }
