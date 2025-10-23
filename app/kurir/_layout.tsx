
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
        name="profil"
        options={{ title: "🏠 Profil" }}
      />
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
        name="data-orderan"
        options={{ title: "📋 Data Orderan" }}
      />
      <Drawer.Screen
        name="orderan"
        options={{ title: "📋 Orderan" }}
      />
      <Drawer.Screen
        name="orderansaya"
        options={{ title: "📋 Orderan Saya" }}
      />
      <Drawer.Screen
        name="riwayat"
        options={{ title: "📋 Riwayat" }}
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
      {/* <Drawer.Screen name="../logout" options={{ title: "🚪 Logout" }} /> */}

    </Drawer>
  );
}

