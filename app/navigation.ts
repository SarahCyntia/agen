// navigation.ts
import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: never, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params);
  }
}
