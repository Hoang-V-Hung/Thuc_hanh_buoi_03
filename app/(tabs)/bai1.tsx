import { View, StyleSheet } from "react-native";
import BusinessCard from "../../components/BusinessCard";

export default function Bai1() {
  return (
    <View style={styles.container}>
      <BusinessCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF2FF" },
});
