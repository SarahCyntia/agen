import React, { useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Input from "./agen/input";
import Dashboard from "./dashboard";
import Data from "./data";
import Logout from "./logout";
// import RoleList from "@/screens/RoleList";
// import RoleInfo from "@/screens/RoleInfo";



export default function HomeScreen() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Animasi lebar sidebar
  const sidebarWidth = useRef(new Animated.Value(220)).current;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    Animated.timing(sidebarWidth, {
      toValue: sidebarOpen ? 60 : 220, // kecil → besar
      duration: 300, // lama animasi (ms)
      useNativeDriver: false,
    }).start();
  };

  const renderContent = () => {
  switch (activeMenu) {
    case "dashboard":
      return <Dashboard />;
    case "data":
      return <Data />;
    case "input":
      return <Input />;
    // case "rolelist": // 🆕 tambahkan ini
    //   return <RoleList />;
    case "logout":
      return <Logout />;
    default:
      return <Dashboard />;
  }
};

  // const renderContent = () => {
  //   switch (activeMenu) {
  //     case "dashboard":
  //       return <Dashboard />;
  //     case "data":
  //       return <Data />;
  //     case "input":
  //       return <Input />;
  //     case "logout":
  //       return <Logout />;
  //     default:
  //       return <Dashboard />;
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* Sidebar dengan animasi */}
      <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
        <TouchableOpacity style={styles.toggleBtn} onPress={toggleSidebar}>
          <Text style={styles.toggleText}>{sidebarOpen ? "◀" : "▶"}</Text>
        </TouchableOpacity>

        {sidebarOpen && (
          <>
            <TouchableOpacity onPress={() => setActiveMenu("dashboard")}>
              <Text
                style={[styles.menu, activeMenu === "dashboard" && styles.active]}
              >
                🏠 Dashboard
              </Text>
            </TouchableOpacity>

            <Text style={styles.section}>📦 Order</Text>

            <TouchableOpacity onPress={() => setActiveMenu("data")}>
              <Text
                style={[styles.subMenu, activeMenu === "data" && styles.active]}
              >
                📋 Data Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveMenu("input")}>
              <Text
                style={[styles.subMenu, activeMenu === "input" && styles.active]}
              >
                ➕ Input Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveMenu("rolelist")}>
  <Text
    style={[styles.menu, activeMenu === "rolelist" && styles.active]}
  >
    👥 Role List
  </Text>
</TouchableOpacity>


            <TouchableOpacity onPress={() => setActiveMenu("logout")}>
              <Text
                style={[styles.menu, activeMenu === "logout" && styles.active]}
              >
                🚪 Logout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>

      {/* Konten */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: {
    backgroundColor: "#111",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  toggleBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  toggleText: {
    color: "#fff",
    fontSize: 20,
  },
  menu: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 12,
  },
  subMenu: {
    color: "#bbb",
    fontSize: 14,
    marginVertical: 8,
    marginLeft: 20,
  },
  section: {
    color: "#888",
    fontSize: 13,
    marginTop: 15,
    marginBottom: 5,
  },
  active: {
    fontWeight: "bold",
    color: "#4da6ff",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    padding: 20,
  },
});
