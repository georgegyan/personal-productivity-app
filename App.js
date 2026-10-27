
import React, { useEffect, useState } from "react";
import { Alert, Keyboard, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "@personal_productivity_tasks";

const initialTasks = [
  {
    id: "1",
    title: "Review my daily goals",
    completed: false,
  },
  {
    id: "2",
    title: "Learn React Native",
    completed: false,
  },
  {
    id: "3",
    title: "Complete my daily practice",
    completed: false,
  },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load previously saved tasks when the app starts.
  useEffect(() => {
    async function loadTasks() {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedTasks !== null) {
          const parsedTasks = JSON.parse(savedTasks);

          if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks);
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

  // Save tasks whenever they change, but only after loading finishes.
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

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

  function addTask() {
    const trimmedTitle = taskTitle.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage("Please enter a task first.");
      return;
    }

    const newTask = {
      id: `${Date.now()}-${Math.random()}`,
      title: trimmedTitle,
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setTaskTitle("");
    setErrorMessage("");
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
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTasks((currentTasks) =>
              currentTasks.filter((task) => task.id !== taskId)
            );
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

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.loadingText}>Loading your tasks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8F8" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>MY PRODUCTIVITY</Text>
          <Text style={styles.heading}>Stay focused.</Text>
          <Text style={styles.subtitle}>
            Small steps every day lead to big results.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Daily progress</Text>
              <Text style={styles.progressSubtitle}>
                Keep moving forward
              </Text>
            </View>

            <Text style={styles.progressPercentage}>{progress}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.progressCount}>
            {completedCount} of {totalTasks} tasks completed
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My tasks</Text>
          <Text style={styles.taskCount}>{totalTasks} total</Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="What do you need to do?"
            placeholderTextColor="#8A9999"
            value={taskTitle}
            onChangeText={(text) => {
              setTaskTitle(text);
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
            onSubmitEditing={addTask}
            returnKeyType="done"
            maxLength={120}
          />

          <Pressable
            style={styles.addButton}
            onPress={addTask}
          >
            <Text style={styles.addButtonText}>Add task</Text>
          </Pressable>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>All clear!</Text>
            <Text style={styles.emptyText}>
              You have no tasks right now. Add one above to get started.
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
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

                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.completedTaskTitle,
                  ]}
                >
                  {task.title}
                </Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTask(task.id, task.title)}
                hitSlop={8}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          Your progress is saved automatically on this device.
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
  loadingText: {
    fontSize: 16,
    color: "#526565",
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
  progressSubtitle: {
    fontSize: 13,
    color: "#7B8989",
    marginTop: 5,
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
  progressCount: {
    marginTop: 12,
    fontSize: 13,
    color: "#687979",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#173333",
  },
  taskCount: {
    fontSize: 13,
    color: "#687979",
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
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
  addButton: {
    backgroundColor: "#16877F",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    color: "#C0392B",
    fontSize: 13,
    marginTop: 10,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EEEE",
  },
  taskMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 10,
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#B7C6C6",
    marginRight: 12,
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
  taskTitle: {
    flex: 1,
    fontSize: 14,
    color: "#243B3B",
    lineHeight: 21,
  },
  completedTaskTitle: {
    color: "#94A1A1",
    textDecorationLine: "line-through",
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
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: "#687979",
    lineHeight: 21,
  },
  footer: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 12,
    color: "#8A9999",
  },
});
