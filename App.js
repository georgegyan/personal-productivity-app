
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "@personal_productivity_tasks";

const CATEGORIES = ["Personal", "Study", "Work"];
const FILTERS = ["All", "Pending", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

const initialTasks = [
  {
    id: "1",
    title: "Review my daily goals",
    category: "Personal",
    priority: "Medium",
    dueDate: "",
    completed: false,
  },
  {
    id: "2",
    title: "Learn React Native",
    category: "Study",
    priority: "High",
    dueDate: "",
    completed: false,
  },
  {
    id: "3",
    title: "Complete my daily practice",
    category: "Work",
    priority: "Medium",
    dueDate: "",
    completed: false,
  },
];

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidDate(dateString) {
  if (!dateString) return true;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function getDueDateStatus(dueDate, completed) {
  if (!dueDate) return "";

  if (completed) return "Completed";

  const today = getTodayString();

  if (dueDate < today) return "Overdue";
  if (dueDate === today) return "Due today";

  return "Upcoming";
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Load saved tasks, including tasks created before this update.
  useEffect(() => {
    async function loadTasks() {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedTasks !== null) {
          const parsedTasks = JSON.parse(savedTasks);

          if (Array.isArray(parsedTasks)) {
            const compatibleTasks = parsedTasks.map((task) => ({
              ...task,
              category: CATEGORIES.includes(task.category)
                ? task.category
                : "Personal",
              priority: PRIORITIES.includes(task.priority)
                ? task.priority
                : "Medium",
              dueDate:
                typeof task.dueDate === "string" ? task.dueDate : "",
              completed: Boolean(task.completed),
            }));

            setTasks(compatibleTasks);
          }
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadTasks();
  }, []);

  // Persist changes after the initial load is complete.
  useEffect(() => {
    if (!isLoaded) return;

    async function saveTasks() {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(tasks)
        );
      } catch (error) {
        console.error("Failed to save tasks:", error);
      }
    }

    saveTasks();
  }, [tasks, isLoaded]);

  function resetForm() {
    setTaskTitle("");
    setSelectedCategory("Personal");
    setSelectedPriority("Medium");
    setDueDate("");
    setErrorMessage("");
    setEditingTaskId(null);
  }

  function validateForm() {
    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage("Please enter a task title.");
      return false;
    }

    if (dueDate && !isValidDate(dueDate)) {
      setErrorMessage("Enter a valid date in YYYY-MM-DD format.");
      return false;
    }

    return true;
  }

  function addTask() {
    if (!validateForm()) return;

    const newTask = {
      id: `${Date.now()}-${Math.random()}`,
      title: taskTitle.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate.trim(),
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);

    resetForm();
    Keyboard.dismiss();
  }

  function startEditing(task) {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setSelectedCategory(task.category);
    setSelectedPriority(task.priority);
    setDueDate(task.dueDate || "");
    setErrorMessage("");
  }

  function saveTaskChanges() {
    if (!validateForm()) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title: taskTitle.trim(),
              category: selectedCategory,
              priority: selectedPriority,
              dueDate: dueDate.trim(),
            }
          : task
      )
    );

    resetForm();
    Keyboard.dismiss();
  }

  function cancelEditing() {
    resetForm();
    Keyboard.dismiss();
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(taskId, title) {
    Alert.alert(
      "Delete task",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTasks((currentTasks) =>
              currentTasks.filter((task) => task.id !== taskId)
            );

            if (editingTaskId === taskId) {
              resetForm();
            }
          },
        },
      ]
    );
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedCount / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === "Pending" && task.completed) {
      return false;
    }

    if (selectedFilter === "Completed" && !task.completed) {
      return false;
    }

    return true;
  });

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.subtitle}>Loading your tasks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F8F8"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>MY PRODUCTIVITY</Text>
          <Text style={styles.heading}>Stay focused.</Text>
          <Text style={styles.subtitle}>
            Organize your day, one task at a time.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Daily progress</Text>
              <Text style={styles.subtitleSmall}>
                Keep moving forward
              </Text>
            </View>

            <Text style={styles.progressPercentage}>
              {progress}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.subtitleSmall}>
            {completedCount} of {totalTasks} tasks completed
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {editingTaskId ? "Edit task" : "Add a task"}
        </Text>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="What do you need to do?"
            placeholderTextColor="#8A9999"
            value={taskTitle}
            onChangeText={(text) => {
              setTaskTitle(text);
              if (errorMessage) setErrorMessage("");
            }}
            onSubmitEditing={
              editingTaskId ? saveTaskChanges : addTask
            }
            returnKeyType="done"
            maxLength={120}
          />

          <Text style={styles.fieldLabel}>Choose a category</Text>

          <View style={styles.categoryRow}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category &&
                      styles.categoryButtonTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Set priority</Text>

          <View style={styles.categoryRow}>
            {PRIORITIES.map((priority) => (
              <Pressable
                key={priority}
                style={[
                  styles.categoryButton,
                  selectedPriority === priority &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedPriority(priority)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedPriority === priority &&
                      styles.categoryButtonTextSelected,
                  ]}
                >
                  {priority}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Due date (optional)</Text>

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD, e.g. 2026-11-15"
            placeholderTextColor="#8A9999"
            value={dueDate}
            onChangeText={(text) => {
              setDueDate(text);
              if (errorMessage) setErrorMessage("");
            }}
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
            maxLength={10}
          />

          <Text style={styles.dateHint}>
            Use year-month-day format, or leave blank.
          </Text>

          <Pressable
            style={styles.addButton}
            onPress={editingTaskId ? saveTaskChanges : addTask}
          >
            <Text style={styles.addButtonText}>
              {editingTaskId ? "Save changes" : "Add task"}
            </Text>
          </Pressable>

          {editingTaskId ? (
            <Pressable
              style={styles.cancelButton}
              onPress={cancelEditing}
            >
              <Text style={styles.cancelButtonText}>
                Cancel editing
              </Text>
            </Pressable>
          ) : null}

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My tasks</Text>
          <Text style={styles.subtitleSmall}>
            {filteredTasks.length} shown
          </Text>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter &&
                  styles.filterButtonSelected,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter &&
                    styles.filterTextSelected,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks to show</Text>
            <Text style={styles.subtitleSmall}>
              Try another filter or add a new task.
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => {
            const dateStatus = getDueDateStatus(
              task.dueDate,
              task.completed
            );

            return (
              <View key={task.id} style={styles.taskCard}>
                <Pressable
                  style={styles.taskMain}
                  onPress={() => toggleTask(task.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      task.completed && styles.checkboxCompleted,
                    ]}
                  >
                    {task.completed ? (
                      <Text style={styles.checkmark}>✓</Text>
                    ) : null}
                  </View>

                  <View style={styles.taskTextContainer}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.completedTaskTitle,
                      ]}
                    >
                      {task.title}
                    </Text>

                    <Text style={styles.taskCategory}>
                      {task.category}
                    </Text>

                    <View style={styles.metadataRow}>
                      <Text
                        style={[
                          styles.priorityBadge,
                          task.priority === "High" && styles.highPriority,
                          task.priority === "Medium" &&
                            styles.mediumPriority,
                          task.priority === "Low" && styles.lowPriority,
                        ]}
                      >
                        {task.priority} priority
                      </Text>
                    </View>

                    {task.dueDate ? (
                      <Text
                        style={[
                          styles.dueDateText,
                          dateStatus === "Overdue" &&
                            styles.overdueText,
                        ]}
                      >
                        Due: {task.dueDate} · {dateStatus}
                      </Text>
                    ) : (
                      <Text style={styles.noDueDateText}>
                        No due date
                      </Text>
                    )}
                  </View>
                </Pressable>

                <View style={styles.taskActions}>
                  <Pressable
                    style={styles.editButton}
                    onPress={() => startEditing(task)}
                    hitSlop={8}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => deleteTask(task.id, task.title)}
                    hitSlop={8}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.footer}>
          Your tasks are saved automatically on this device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F8",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F8F8",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#16877F",
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#173333",
  },
  subtitle: {
    fontSize: 15,
    color: "#687979",
    marginTop: 8,
    lineHeight: 22,
  },
  subtitleSmall: {
    fontSize: 13,
    color: "#687979",
    marginTop: 6,
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E6EEEE",
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#173333",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "800",
    color: "#16877F",
  },
  progressTrack: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#E6EEEE",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#16877F",
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#173333",
    marginBottom: 14,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E6EEEE",
  },
  input: {
    backgroundColor: "#F7FAFA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#173333",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#526565",
    marginTop: 14,
    marginBottom: 10,
  },
  dateHint: {
    fontSize: 11,
    color: "#8A9999",
    marginTop: 7,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#DCE6E6",
    backgroundColor: "#FFFFFF",
  },
  categoryButtonSelected: {
    backgroundColor: "#16877F",
    borderColor: "#16877F",
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#526565",
  },
  categoryButtonTextSelected: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#16877F",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 6,
  },
  cancelButtonText: {
    color: "#687979",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#C0392B",
    fontSize: 13,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#E8EEEE",
  },
  filterButtonSelected: {
    backgroundColor: "#173F3C",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#526565",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#E6EEEE",
  },
  taskMain: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#B7C6C6",
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#16877F",
    borderColor: "#16877F",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: "#243B3B",
    lineHeight: 21,
  },
  completedTaskTitle: {
    color: "#94A1A1",
    textDecorationLine: "line-through",
  },
  taskCategory: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16877F",
    marginTop: 5,
  },
  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  priorityBadge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  highPriority: {
    color: "#B42318",
    backgroundColor: "#FEE4E2",
  },
  mediumPriority: {
    color: "#92400E",
    backgroundColor: "#FEF3C7",
  },
  lowPriority: {
    color: "#166534",
    backgroundColor: "#DCFCE7",
  },
  dueDateText: {
    fontSize: 11,
    color: "#526565",
    marginTop: 7,
  },
  overdueText: {
    color: "#C0392B",
    fontWeight: "700",
  },
  noDueDateText: {
    fontSize: 11,
    color: "#8A9999",
    marginTop: 7,
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#E7F5F3",
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#16877F",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#FFF0EF",
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#C0392B",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    borderWidth: 1,
    borderColor: "#E6EEEE",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#173333",
    marginBottom: 5,
  },
  footer: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 12,
    color: "#8A9999",
  },
});
