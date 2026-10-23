
import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialTasks = [
  { id: "1", title: "Review my daily goals", completed: false },
  { id: "2", title: "Learn React Native", completed: false },
  { id: "3", title: "Complete my daily practice", completed: false },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
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

        <Text style={styles.sectionTitle}>
          Today's tasks
        </Text>

        {tasks.map((task) => (
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
              {task.completed && (
                <Text style={styles.checkmark}>✓</Text>
              )}
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
        ))}

        <Text style={styles.footer}>
          Small steps. Consistent progress.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 18,
  },
});
