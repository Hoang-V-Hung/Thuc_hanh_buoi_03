import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ScoreCalculator() {
    const [toan, setToan] = useState("");
    const [ly, setLy] = useState("");
    const [hoa, setHoa] = useState("");
    const [result, setResult] = useState<number | null>(null);
    const [classification, setClassification] = useState("");
    const [errors, setErrors] = useState({ toan: "", ly: "", hoa: "" });

    const validateScore = (score: string): boolean => {
        if (!score.trim()) return false;
        const num = Number(score);
        return !isNaN(num) && num >= 0 && num <= 10;
    };

    const handleScoreInput = (value: string, setter: (val: string) => void, field: "toan" | "ly" | "hoa") => {
        setErrors(prev => ({ ...prev, [field]: "" }));

        const filtered = value.replace(/[^0-9.]/g, '');

        const parts = filtered.split('.');
        if (parts.length > 2) return;

        if (parts[1] && parts[1].length > 2) return;

        const num = Number(filtered);
        if (num > 10) return;

        setter(filtered);
    };

    const validateField = (value: string, field: "toan" | "ly" | "hoa", fieldName: string) => {
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, [field]: `Vui lòng nhập điểm ${fieldName}` }));
            return false;
        }

        const num = Number(value);
        if (isNaN(num)) {
            setErrors(prev => ({ ...prev, [field]: `Điểm ${fieldName} phải là số` }));
            return false;
        }

        if (num < 0 || num > 10) {
            setErrors(prev => ({ ...prev, [field]: `Điểm ${fieldName} phải từ 0-10` }));
            return false;
        }

        setErrors(prev => ({ ...prev, [field]: "" }));
        return true;
    };

    const calcAverage = () => {
        setErrors({ toan: "", ly: "", hoa: "" });

        if (!toan.trim() || !ly.trim() || !hoa.trim()) {
            const newErrors = {
                toan: !toan.trim() ? "Vui lòng nhập điểm Toán" : "",
                ly: !ly.trim() ? "Vui lòng nhập điểm Lý" : "",
                hoa: !hoa.trim() ? "Vui lòng nhập điểm Hóa" : "",
            };
            setErrors(newErrors);
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ điểm 3 môn học!");
            return;
        }

        const t = Number(toan);
        const l = Number(ly);
        const h = Number(hoa);

        if (isNaN(t) || isNaN(l) || isNaN(h)) {
            const newErrors = {
                toan: isNaN(t) ? "Điểm Toán phải là số" : "",
                ly: isNaN(l) ? "Điểm Lý phải là số" : "",
                hoa: isNaN(h) ? "Điểm Hóa phải là số" : "",
            };
            setErrors(newErrors);
            Alert.alert("Lỗi", "Vui lòng nhập số hợp lệ cho tất cả các môn!");
            return;
        }

        if (!validateScore(toan) || !validateScore(ly) || !validateScore(hoa)) {
            const newErrors = {
                toan: !validateScore(toan) ? "Điểm không hợp lệ (0-10)" : "",
                ly: !validateScore(ly) ? "Điểm không hợp lệ (0-10)" : "",
                hoa: !validateScore(hoa) ? "Điểm không hợp lệ (0-10)" : "",
            };
            setErrors(newErrors);
            Alert.alert("Lỗi", "Vui lòng nhập điểm hợp lệ từ 0 đến 10!");
            return;
        }

        const avg = (t + l + h) / 3;
        setResult(avg);

        if (avg >= 9) setClassification("Xuất sắc");
        else if (avg >= 8) setClassification("Giỏi");
        else if (avg >= 6.5) setClassification("Khá");
        else if (avg >= 5) setClassification("Trung bình");
        else if (avg >= 3.5) setClassification("Yếu");
        else setClassification("Kém");
    };

    const reset = () => {
        setToan("");
        setLy("");
        setHoa("");
        setResult(null);
        setClassification("");
        setErrors({ toan: "", ly: "", hoa: "" });
    };

    const getClassificationColor = () => {
        if (classification === "Xuất sắc") return "#7C3AED";
        if (classification === "Giỏi") return "#059669";
        if (classification === "Khá") return "#0891B2";
        if (classification === "Trung bình") return "#F59E0B";
        if (classification === "Yếu") return "#EF4444";
        return "#DC2626";
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>📊 Tính điểm trung bình</Text>
                <Text style={styles.subtitle}>Nhập điểm 3 môn học (0-10)</Text>

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>🧮 Toán</Text>
                        <TextInput
                            placeholder="Ví dụ: 8.5"
                            keyboardType="decimal-pad"
                            style={[styles.input, errors.toan && styles.inputError]}
                            value={toan}
                            onChangeText={(val) => handleScoreInput(val, setToan, "toan")}
                            onBlur={() => toan && validateField(toan, "toan", "Toán")}
                        />
                        {errors.toan ? <Text style={styles.errorText}>{errors.toan}</Text> : null}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>⚗️ Lý</Text>
                        <TextInput
                            placeholder="Ví dụ: 7.0"
                            keyboardType="decimal-pad"
                            style={[styles.input, errors.ly && styles.inputError]}
                            value={ly}
                            onChangeText={(val) => handleScoreInput(val, setLy, "ly")}
                            onBlur={() => ly && validateField(ly, "ly", "Lý")}
                        />
                        {errors.ly ? <Text style={styles.errorText}>{errors.ly}</Text> : null}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>🧪 Hóa</Text>
                        <TextInput
                            placeholder="Ví dụ: 9.0"
                            keyboardType="decimal-pad"
                            style={[styles.input, errors.hoa && styles.inputError]}
                            value={hoa}
                            onChangeText={(val) => handleScoreInput(val, setHoa, "hoa")}
                            onBlur={() => hoa && validateField(hoa, "hoa", "Hóa")}
                        />
                        {errors.hoa ? <Text style={styles.errorText}>{errors.hoa}</Text> : null}
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.calculateButton,
                            (!toan || !ly || !hoa || errors.toan || errors.ly || errors.hoa) && styles.calculateButtonDisabled
                        ]}
                        onPress={calcAverage}
                        disabled={!toan || !ly || !hoa || !!errors.toan || !!errors.ly || !!errors.hoa}
                    >
                        <Text style={styles.buttonText}>Tính điểm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={reset}>
                        <Text style={styles.resetButtonText}>Làm mới</Text>
                    </TouchableOpacity>
                </View>
                {result !== null && (
                    <View style={styles.resultContainer}>
                        <View style={styles.resultCard}>
                            <Text style={styles.resultLabel}>Điểm trung bình</Text>
                            <Text style={styles.resultValue}>{result.toFixed(2)}</Text>
                            <View style={styles.scoreBreakdown}>
                                <Text style={styles.breakdownText}>
                                    Toán: {Number(toan).toFixed(1)} • Lý: {Number(ly).toFixed(1)} • Hóa: {Number(hoa).toFixed(1)}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.resultCard, styles.classificationCard, { borderColor: getClassificationColor() }]}>
                            <Text style={styles.resultLabel}>Xếp loại</Text>
                            <Text style={[styles.resultValue, { color: getClassificationColor() }]}>
                                {classification}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEF2FF",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 28,
        width: "100%",
        maxWidth: 400,
        shadowColor: "#5A67D8",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 6,
        textAlign: "center",
        color: "#1F2937",
    },
    subtitle: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 24,
    },
    inputContainer: {
        gap: 16,
        marginBottom: 24,
    },
    inputWrapper: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginLeft: 4,
    },
    input: {
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
        fontSize: 16,
        backgroundColor: "#F9FAFB",
        color: "#1F2937",
    },
    inputError: {
        borderColor: "#EF4444",
        backgroundColor: "#FEE2E2",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 13,
        marginLeft: 4,
        marginTop: 4,
        fontWeight: "500",
    },
    buttonContainer: {
        gap: 12,
        marginBottom: 20,
    },
    calculateButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#5A67D8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    calculateButtonDisabled: {
        backgroundColor: "#CBD5E1",
        shadowOpacity: 0.1,
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
    resetButton: {
        backgroundColor: "#F3F4F6",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E5E7EB",
    },
    resetButtonText: {
        color: "#6B7280",
        fontSize: 16,
        fontWeight: "600",
    },
    resultContainer: {
        gap: 12,
    },
    resultCard: {
        backgroundColor: "#EEF2FF",
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E0E7FF",
    },
    classificationCard: {
        backgroundColor: "#F9FAFB",
    },
    resultLabel: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "600",
        marginBottom: 8,
    },
    resultValue: {
        fontSize: 32,
        fontWeight: "800",
        color: "#5A67D8",
    },
    scoreBreakdown: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#E0E7FF",
    },
    breakdownText: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "500",
    },
});