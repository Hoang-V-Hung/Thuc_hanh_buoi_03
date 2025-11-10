import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface Task {
    id: string;
    text: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
}

export default function TodoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [isLoaded, setIsLoaded] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");


    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem('@tasks');
                if (storedTasks !== null) {
                    const tasksFromStorage = JSON.parse(storedTasks);
                    const tasksWithDates = tasksFromStorage.map((t: Task) => ({
                        ...t,
                        createdAt: new Date(t.createdAt)
                    }));
                    setTasks(tasksWithDates);
                }
            } catch (e) {
                console.error("Lỗi: Không thể tải công việc.", e);
            } finally {
                setIsLoaded(true);
            }
        };

        loadTasks();
    }, []);
    useEffect(() => {
        if (isLoaded) {
            const saveTasks = async () => {
                try {
                    const jsonValue = JSON.stringify(tasks);
                    await AsyncStorage.setItem('@tasks', jsonValue);
                } catch (e) {
                    console.error("Lỗi: Không thể lưu công việc.", e);
                }
            };
            saveTasks();
        }
    }, [tasks, isLoaded]);

    const openAddModal = () => {
        setEditingTask(null);
        setTaskTitle("");
        setTaskDescription("");
        setModalVisible(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setTaskTitle(task.text);
        setTaskDescription(task.description || "");
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingTask(null);
        setTaskTitle("");
        setTaskDescription("");
    };

    const saveTask = () => {
        const trimmedTitle = taskTitle.trim();

        if (!trimmedTitle) {
            Alert.alert("Thông báo", "Vui lòng nhập tên công việc!");
            return;
        }

        if (trimmedTitle.length < 3) {
            Alert.alert("Thông báo", "Tên công việc phải có ít nhất 3 ký tự!");
            return;
        }

        const isDuplicate = tasks.some(
            t => t.text.toLowerCase() === trimmedTitle.toLowerCase() && t.id !== editingTask?.id
        );
        if (isDuplicate) {
            Alert.alert("Thông báo", "Công việc này đã tồn tại!");
            return;
        }

        if (trimmedTitle.length > 300) {
            Alert.alert("Thông báo", "Tên công việc không được dài quá 300 ký tự!");
            return;
        }

        if (editingTask) {
            setTasks(tasks.map(t =>
                t.id === editingTask.id
                    ? { ...t, text: trimmedTitle, description: taskDescription.trim() }
                    : t
            ));
            Alert.alert("Thành công", "Đã cập nhật công việc!");
        } else {
            const newTask: Task = {
                id: Date.now().toString(),
                text: trimmedTitle,
                description: taskDescription.trim(),
                completed: false,
                createdAt: new Date(),
            };
            setTasks([newTask, ...tasks]);
        }

        closeModal();
    };

    const toggleTask = (id: string) => {
        const taskToToggle = tasks.find(t => t.id === id);

        if (taskToToggle) {
            if (!taskToToggle.completed) {
                setFilter("completed");
            } else {
                setFilter("active");
            }
        }

        setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const deleteTask = (id: string) => {
        console.log("--- ĐÃ NHẤN NÚT XÓA VỚI ID:", id);
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc muốn xóa công việc này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => {
                        setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
                    },
                },
            ]
        );
    };

    const deleteAllCompleted = () => {
        const completedTasks = tasks.filter(t => t.completed);
        if (completedTasks.length === 0) {
            Alert.alert("Thông báo", "Không có công việc đã hoàn thành để xóa!");
            return;
        }

        Alert.alert(
            "Xác nhận",
            `Xóa tất cả ${completedTasks.length} công việc đã hoàn thành?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => {
                        setTasks(prevTasks => prevTasks.filter(t => !t.completed));
                    },
                },
            ]
        );
    };

    const getFilteredTasks = () => {
        if (filter === "active") return tasks.filter(t => !t.completed);
        if (filter === "completed") return tasks.filter(t => t.completed);
        return tasks;
    };

    const filteredTasks = getFilteredTasks();
    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = tasks.filter(t => !t.completed).length;
    const totalCount = tasks.length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Danh sách công việc</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{totalCount}</Text>
                        <Text style={styles.statLabel}>Tổng số</Text>
                    </View>
                    <View style={[styles.statBox, styles.activeBox]}>
                        <Text style={[styles.statNumber, styles.activeNumber]}>{activeCount}</Text>
                        <Text style={styles.statLabel}>Đang làm</Text>
                    </View>
                    <View style={[styles.statBox, styles.completedBox]}>
                        <Text style={[styles.statNumber, styles.completedNumber]}>{completedCount}</Text>
                        <Text style={styles.statLabel}>Hoàn thành</Text>
                    </View>
                </View>
            </View>

            <View style={styles.addButtonContainer}>
                <TouchableOpacity style={styles.floatingAddButton} onPress={openAddModal}>
                    <Text style={styles.floatingAddButtonText}>Thêm công việc mới</Text>
                </TouchableOpacity>
            </View>

            {totalCount > 0 && (
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
                        onPress={() => setFilter("all")}
                    >
                        <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
                            Tất cả ({totalCount})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "active" && styles.filterButtonActive]}
                        onPress={() => setFilter("active")}
                    >
                        <Text style={[styles.filterText, filter === "active" && styles.filterTextActive]}>
                            Đang làm ({activeCount})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "completed" && styles.filterButtonActive]}
                        onPress={() => setFilter("completed")}
                    >
                        <Text style={[styles.filterText, filter === "completed" && styles.filterTextActive]}>
                            Xong ({completedCount})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={filteredTasks}
                renderItem={({ item }) => (
                    <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>

                        <View style={styles.taskContent}>

                            <View style={styles.taskTextContainer}>
                                <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                                    {item.text}
                                </Text>
                                {item.description ? (
                                    <Text style={[styles.taskDescription, item.completed && styles.taskDescriptionCompleted]}>
                                        {item.description}
                                    </Text>
                                ) : null}
                                <Text style={styles.taskTime}>
                                    {new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                onPress={() => toggleTask(item.id)}
                                style={styles.toggleButton}
                            >
                                <Text style={styles.toggleButtonText}>
                                    {item.completed ? '↩️' : '✔️'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => openEditModal(item)}
                                style={styles.editButton}
                            >
                                <Text style={styles.editText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => deleteTask(item.id)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteText}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>📝</Text>
                        <Text style={styles.emptySubtext}>
                            {filter === "all"
                                ? "Chưa có công việc nào"
                                : filter === "active"
                                    ? "Không có công việc đang làm"
                                    : "Không có công việc đã hoàn thành"}
                        </Text>
                        <TouchableOpacity style={styles.emptyAddButton} onPress={openAddModal}>
                            <Text style={styles.emptyAddButtonText}>Thêm công việc đầu tiên</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={closeModal}
                    />
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {editingTask ? "✏️ Chỉnh sửa công việc" : "➕ Thêm công việc mới"}
                                </Text>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Tên công việc *</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Nhập tên công việc..."
                                        value={taskTitle}
                                        onChangeText={setTaskTitle}
                                        maxLength={100}
                                        autoFocus
                                    />
                                    <Text style={styles.charCount}>{taskTitle.length}/100</Text>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Mô tả (Tùy chọn)</Text>
                                    <TextInput
                                        style={[styles.modalInput, styles.modalTextArea]}
                                        placeholder="Thêm mô tả chi tiết..."
                                        value={taskDescription}
                                        onChangeText={setTaskDescription}
                                        maxLength={500}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                    <Text style={styles.charCount}>{taskDescription.length}/500</Text>
                                </View>
                            </View>

                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeModal}
                                >
                                    <Text style={styles.cancelButtonText}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.saveButton,
                                        !taskTitle.trim() && styles.saveButtonDisabled
                                    ]}
                                    onPress={saveTask}
                                    disabled={!taskTitle.trim()}
                                >
                                    <Text style={styles.saveButtonText}>
                                        {editingTask ? "Cập nhật" : "Thêm"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF2FF",
    },
    header: {
        backgroundColor: "#fff",
        padding: 20,
        paddingTop: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#5A67D8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    statBox: {
        flex: 1,
        backgroundColor: "#EEF2FF",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E0E7FF",
    },
    activeBox: {
        backgroundColor: "#FEF3C7",
        borderColor: "#FDE68A",
    },
    completedBox: {
        backgroundColor: "#ECFDF5",
        borderColor: "#D1FAE5",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "800",
        color: "#5A67D8",
        marginBottom: 2,
    },
    activeNumber: {
        color: "#F59E0B",
    },
    completedNumber: {
        color: "#059669",
    },
    statLabel: {
        fontSize: 11,
        color: "#6B7280",
        fontWeight: "600",
    },
    addButtonContainer: {
        padding: 20,
        paddingBottom: 12,
    },
    floatingAddButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#5A67D8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    floatingAddButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingBottom: 12,
        gap: 8,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#E5E7EB",
        alignItems: "center",
    },
    filterButtonActive: {
        backgroundColor: "#5A67D8",
        borderColor: "#5A67D8",
    },
    filterText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
    },
    filterTextActive: {
        color: "#fff",
    },
    listContainer: {
        padding: 20,
        paddingTop: 0,
        gap: 12,
    },
    taskItem: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: "transparent",
    },
    taskItemCompleted: {
        backgroundColor: "#F9FAFB",
        borderColor: "#E5E7EB",
    },
    taskContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        // gap: 12, // XÓA DÒNG NÀY
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    checkboxCompleted: {
        backgroundColor: "#059669",
        borderColor: "#059669",
    },
    checkmark: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    taskTextContainer: {
        flex: 1,
    },
    taskText: {
        fontSize: 16,
        color: "#1F2937",
        fontWeight: "600",
        marginBottom: 2,
    },
    taskTextCompleted: {
        textDecorationLine: "line-through",
        color: "#9CA3AF",
    },
    taskDescription: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 4,
        lineHeight: 20,
    },
    taskDescriptionCompleted: {
        color: "#9CA3AF",
        textDecorationLine: "line-through",
    },
    taskTime: {
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center", // THÊM DÒNG NÀY
    },
    toggleButton: {
        padding: 8,
    },
    toggleButtonText: {
        fontSize: 20,
    },
    editButton: {
        padding: 8,
    },
    editText: {
        fontSize: 20,
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        fontSize: 20,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 64,
        marginBottom: 12,
    },
    emptySubtext: {
        fontSize: 16,
        color: "#9CA3AF",
        fontWeight: "500",
        marginBottom: 20,
    },
    emptyAddButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    emptyAddButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    footerContainer: {
        padding: 20,
        paddingTop: 0,
    },
    deleteAllButton: {
        backgroundColor: "#FEE2E2",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FECACA",
    },
    deleteAllText: {
        color: "#DC2626",
        fontSize: 15,
        fontWeight: "700",
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "80%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1F2937",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 20,
        color: "#6B7280",
        fontWeight: "600",
    },
    modalBody: {
        padding: 20,
        gap: 20,
    },
    formGroup: {
        gap: 8,
    },
    formLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#374151",
        marginLeft: 4,
    },
    modalInput: {
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
        fontSize: 16,
        backgroundColor: "#F9FAFB",
        color: "#1F2937",
    },
    modalTextArea: {
        height: 100,
        paddingTop: 14,
    },
    charCount: {
        fontSize: 12,
        color: "#9CA3AF",
        textAlign: "right",
        marginTop: 4,
    },
    modalFooter: {
        flexDirection: "row",
        gap: 12,
        padding: 20,
        paddingTop: 0,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E5E7EB",
    },
    cancelButtonText: {
        color: "#6B7280",
        fontSize: 16,
        fontWeight: "700",
    },
    saveButton: {
        flex: 1,
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
    saveButtonDisabled: {
        backgroundColor: "#CBD5E1",
        shadowOpacity: 0.1,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});