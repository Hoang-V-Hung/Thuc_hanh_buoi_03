import { View, StyleSheet } from "react-native";
import WeatherApp from "../../components/WeatherApp";

export default function Bai5() {
  return (
    <View style={styles.container}>
      <WeatherApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
