
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <Text style={styles.greeting}>
          Good day!
        </Text>

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
            0 of 3 tasks completed
          </Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Today's tasks
        </Text>

        <View style={styles.taskCard}>
          <View style={styles.taskIndicator} />
          <Text style={styles.taskText}>
            Review my daily goals
          </Text>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskIndicator} />
          <Text style={styles.taskText}>
            Learn React Native
          </Text>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskIndicator} />
          <Text style={styles.taskText}>
            Complete my daily practice
          </Text>
        </View>

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
    width: "0%",
    height: "100%",
    backgroundColor: "#FFFFFF",
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
  taskIndicator: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    marginRight: 14,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 18,
  },
});
