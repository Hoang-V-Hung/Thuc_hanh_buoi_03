import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#5A67D8",
      }}
    >
      <Tabs.Screen
        name="bai1"
        options={{
          title: "Bài 1",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bai2"
        options={{
          title: "Bài 2",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bai3"
        options={{
          title: "Bài 3",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="color-palette" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bai4"
        options={{
          title: "Bài 4",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bai5"
        options={{
          title: "Bài 5",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
