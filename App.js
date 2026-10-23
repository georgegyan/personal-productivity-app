
import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, Pressable, TextInput, ScrollView, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialTasks = [
  { id: "1", title: "Review my daily goals", completed: false },
  { id: "2", title: "Learn React Native", completed: false },
  { id: "3", title: "Complete my daily practice", completed: false },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : (completedCount / tasks.length) * 100;

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function addTask() {
    const trimmedTitle = taskTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage("Please enter a task title.");
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Good day!</Text>

        <Text style={styles.heading}>
          Let's get things done.
        </Text>

        <Text style={styles.description}>
          Organise your tasks and make today productive.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>
            TODAY'S PROGRESS
          </Text>

          <Text style={styles.progressNumber}>
            {completedCount} of {tasks.length} tasks completed
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.progressPercentage}>
            {Math.round(progress)}% complete
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Add a new task</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.taskInput}
            placeholder="What do you need to do?"
            placeholderTextColor="#94A3B8"
            value={taskTitle}
            onChangeText={(text) => {
              setTaskTitle(text);
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
            onSubmitEditing={addTask}
            returnKeyType="done"
            accessibilityLabel="New task title"
          />

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={addTask}
            accessibilityRole="button"
            accessibilityLabel="Add task"
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Text style={styles.sectionTitle}>Today's tasks</Text>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptyDescription}>
              Add a task above to get started.
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <Pressable
              key={task.id}
              style={({ pressed }) => [
                styles.taskCard,
                pressed && styles.taskCardPressed,
              ]}
              onPress={() => toggleTask(task.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: task.completed }}
            >
              <View
                style={[
                  styles.taskIndicator,
                  task.completed && styles.taskIndicatorCompleted,
                ]}
              >
                {task.completed ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null}
              </View>

              <Text
                style={[
                  styles.taskText,
                  task.completed && styles.taskTextCompleted,
                ]}
              >
                {task.title}
              </Text>

              <Text style={styles.taskAction}>
                {task.completed ? "Done" : ""}
              </Text>
            </Pressable>
          ))
        )}

        <Text style={styles.footer}>
          Small steps. Consistent progress.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#64748B",
    marginBottom: 28,
  },
  progressCard: {
    backgroundColor: "#0F766E",
    borderRadius: 20,
    padding: 22,
    marginBottom: 30,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#CCFBF1",
    marginBottom: 12,
  },
  progressNumber: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 18,
  },
  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: "#115E59",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  progressPercentage: {
    fontSize: 12,
    color: "#CCFBF1",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  taskInput: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  addButton: {
    backgroundColor: "#0F766E",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonPressed: {
    opacity: 0.75,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 18,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  taskCardPressed: {
    opacity: 0.7,
  },
  taskIndicator: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  taskIndicatorCompleted: {
    backgroundColor: "#0F766E",
    borderColor: "#0F766E",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
  },
  taskTextCompleted: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  taskAction: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F766E",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 18,
  },
});
