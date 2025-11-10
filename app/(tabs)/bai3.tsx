import { View, StyleSheet } from "react-native";
import ColorChanger from "../../components/ColorChanger";

export default function Bai3() {
  return (
    <View style={styles.container}>
      <ColorChanger />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});