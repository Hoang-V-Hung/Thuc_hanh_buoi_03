import { View, StyleSheet } from "react-native";
import TodoList from "../../components/TodoList";

export default function Bai4() {
  return (
    <View style={styles.container}>
      <TodoList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
