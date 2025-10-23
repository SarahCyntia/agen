import { createNavigationContainerRef, Router } from "@react-navigation/native";
import React from "react";
// import RoleList from "./screens/RoleList";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: never) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name);
  }
}


// export default function App() {
//   return <RoleList />;
// }
// import React, { Component } from "react";
// import { NavigationContainer, NavigationContainerRef , Stack} from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { navigationRef } from "./navigation"; // pastikan path sesuai
// import Dashboard from "./dashboard"; // sesuaikan path
// import InputOrders from "./input";   // sesuaikan path
// import InputForm from "./inputform"; // sesuaikan path
// import { screenOptionsFactory } from "expo-router/build/useScreens";

// const Stack = createNativeStackNavigator();
// // export const navigationRef = createNavigationContainerRef();
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="dashboard" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="dashboard" component={Dashboard} />
//         <Stack.Screen name="data-order" component={InputOrders} />
//         <Stack.Screen name="input" component={InputForm} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

