import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Danh Sách Bài Tập</Text> */}

      <Link href="/bai1" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Bài 1 – Danh thiếp cá nhân</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/bai2" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Bài 2 – Tính điểm trung bình</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/bai3" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Bài 3 – Đổi màu nền</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/bai4" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Bài 4 – Danh sách công việc</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EEF2FF" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 30, color: "#636ee4ff" },
  button: {
    backgroundColor: "#5A67D8",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
