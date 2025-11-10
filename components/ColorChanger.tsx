import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import ColorPicker, { HueSlider, Panel1, Preview } from 'reanimated-color-picker';

export default function ColorChanger() {
    const [color, setColor] = useState("#5A67D8");
    const [colorName, setColorName] = useState("Indigo");
    const scaleAnim = new Animated.Value(1);
    const [pickerModalVisible, setPickerModalVisible] = useState(false);

    const [previewColor, setPreviewColor] = useState(color);
    const [isLoaded, setIsLoaded] = useState(false);

    const COLOR_DATA_KEY = '@color_data';

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedDataString = await AsyncStorage.getItem(COLOR_DATA_KEY);
                if (storedDataString !== null) {
                    const storedData = JSON.parse(storedDataString);

                    if (storedData.color) {
                        setColor(storedData.color);
                        setPreviewColor(storedData.color);
                    }
                    if (storedData.name) {
                        setColorName(storedData.name);
                    }
                }
            } catch (e) {
                console.error("Lỗi: Không thể tải dữ liệu màu.", e);
            } finally {
                setIsLoaded(true);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const saveData = async () => {
                try {
                    const dataToSave = {
                        color: color,
                        name: colorName
                    };
                    const dataString = JSON.stringify(dataToSave);
                    await AsyncStorage.setItem(COLOR_DATA_KEY, dataString);

                } catch (e) {
                    console.error("Lỗi: Không thể lưu dữ liệu màu.", e);
                }
            };
            saveData();
        }
    }, [color, colorName, isLoaded]);

    const randomColor = () => {
        const random = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const hexColor = `#${random}`;
        setColor(hexColor);
        setColorName("Ngẫu nhiên");
        setPreviewColor(hexColor);

        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const onPreviewColorChange = ({ hex }: { hex: string }) => {
        setPreviewColor(hex);
        setColorName("Tùy chỉnh");
    };

    const openColorPicker = () => {
        setPreviewColor(color);
        setPickerModalVisible(true);
    };

    const applyColorAndClose = () => {
        setColor(previewColor);
        setPickerModalVisible(false);
    };

    return (
        <Animated.View style={[styles.container, { backgroundColor: color, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.card}>
                <Text style={styles.title}>🎨 Đổi màu nền</Text>

                <View style={styles.colorDisplay}>
                    <View style={[styles.colorBox, { backgroundColor: color }]} />
                    <Text style={styles.colorName}>{colorName}</Text>
                    <Text style={styles.colorCode}>{color.toUpperCase()}</Text>
                </View>

                <TouchableOpacity style={styles.randomButton} onPress={randomColor}>
                    <Text style={styles.randomButtonText}>🎲 Màu ngẫu nhiên</Text>
                </TouchableOpacity>

                <View style={styles.paletteContainer}>
                    <Text style={styles.paletteTitle}>Hoặc chọn màu chi tiết</Text>
                    <TouchableOpacity
                        style={[styles.colorPickerButton, { backgroundColor: color }]}
                        onPress={openColorPicker}
                    >
                        <Text style={styles.colorPickerButtonText}>🎨</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={pickerModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setPickerModalVisible(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setPickerModalVisible(false)}
                />
                <View style={styles.modalContent}>
                    <ColorPicker
                        style={{ width: '100%', gap: 20 }}
                        value={previewColor}
                        onComplete={onPreviewColorChange}
                        onChange={onPreviewColorChange}
                    >
                        <Preview
                            style={styles.previewBox}
                            hideInitialColor
                        />
                        <Panel1 style={styles.panelStyle} />
                        <HueSlider style={styles.sliderStyle} />

                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={applyColorAndClose}
                        >
                            <Text style={styles.closeModalText}>Chọn màu này</Text>
                        </TouchableOpacity>
                    </ColorPicker>
                </View>
            </Modal>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 24,
        padding: 28,
        width: "100%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
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
    colorDisplay: {
        alignItems: "center",
        marginBottom: 24,
        padding: 20,
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
    },
    colorBox: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 3,
        borderColor: "#fff",
    },
    colorName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
    },
    colorCode: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "600",
    },
    randomButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#5A67D8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    randomButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
    paletteContainer: {
        gap: 12,
        alignItems: "center",
    },
    paletteTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#374151",
        textAlign: "center",
    },
    colorPickerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 3,
        borderColor: "#fff",
    },
    colorPickerButtonText: {
        fontSize: 24,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    panelStyle: {
        width: '100%',
        height: 250,
        borderRadius: 16,
    },
    sliderStyle: {
        height: 40,
        borderRadius: 8,
    },
    previewBox: {
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    closeModalButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 14,
        width: '100%',
        borderRadius: 12,
        alignItems: "center",
    },
    closeModalText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});