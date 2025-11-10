import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function BusinessCard() {
    return (
        <View style={styles.card}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/3675/3675805.png" }}
                    style={styles.avatar}
                />
            </View>

            <Text style={styles.name}>Hoàng Văn Hùng</Text>

            <Text style={styles.job}>Mobile App Developer</Text>

            <View style={styles.divider} />

            <View style={styles.contactContainer}>
                <View style={styles.contactItem}>
                    <Text style={styles.icon}>✉️</Text>
                    <Text style={styles.contactText}>hoangvanhung@gmail.com</Text>
                </View>

                <View style={styles.contactItem}>
                    <Text style={styles.icon}>📱</Text>
                    <Text style={styles.contactText}>0123 456 789</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 32,
        alignItems: "center",
        width: "90%",
        maxWidth: 380,
        shadowColor: "#5A67D8",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    avatarContainer: {
        borderWidth: 4,
        borderColor: "#5A67D8",
        borderRadius: 80,
        padding: 5,
        marginBottom: 20,
        shadowColor: "#5A67D8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    name: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    job: {
        fontSize: 17,
        color: "#5A67D8",
        fontWeight: "600",
        marginBottom: 24,
    },
    divider: {
        height: 2,
        width: "70%",
        backgroundColor: "#5A67D8",
        marginBottom: 24,
        opacity: 0.2,
        borderRadius: 1,
    },
    contactContainer: {
        width: "100%",
        gap: 12,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEF2FF",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E0E7FF",
    },
    icon: {
        fontSize: 22,
        marginRight: 12,
    },
    contactText: {
        fontSize: 15,
        color: "#4B5563",
        fontWeight: "500",
        flex: 1,
    },
});