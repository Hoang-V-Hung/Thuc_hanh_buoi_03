import { View, StyleSheet } from "react-native";
import ScoreCalculator from "../../components/ScoreCalculator";

export default function Bai2() {
  return (
    <View style={styles.container}>
      <ScoreCalculator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});