import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: never) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name);
  }
}

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Home } from "./screens/Home";
// import { New } from "./screens/New";
// import { Habit } from "./screens/Habit";  