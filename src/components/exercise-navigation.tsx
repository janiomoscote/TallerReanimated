import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export type ExerciseId =
  | "scale"
  | "move"
  | "rotate"
  | "drag"
  | "loading"
  | "multitouch"
  | "bounce"
  | "carousel"
  | "accelerometer";

const exercises: { id: ExerciseId; title: string }[] = [
  { id: "scale", title: "Scale" },
  { id: "move", title: "Move" },
  { id: "rotate", title: "Rotate" },
  { id: "drag", title: "Drag and Rotate" },
  { id: "loading", title: "Loading Animation" },
  { id: "multitouch", title: "Multitouch Gestures" },
  { id: "bounce", title: "Bounce Animation" },
  { id: "carousel", title: "Animated Carousel" },
  { id: "accelerometer", title: "Accelerometer Animation" },
];

type ExerciseNavigationProps = {
  activeExercise: ExerciseId;
  onSelect: (exercise: ExerciseId) => void;
};

export function ExerciseNavigation({
  activeExercise,
  onSelect,
}: ExerciseNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const activeTitle =
    exercises.find((exercise) => exercise.id === activeExercise)?.title ??
    "Exercises";

  return (
    <>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Open exercise menu"
          accessibilityRole="button"
          onPress={() => setIsOpen(true)}
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>Menu</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{activeTitle}</Text>
      </View>

      {isOpen && (
        <View style={styles.overlay}>
          <Pressable
            accessibilityLabel="Close exercise menu"
            accessibilityRole="button"
            onPress={() => setIsOpen(false)}
            style={styles.scrim}
          />
          <View style={[styles.drawer, { width: Math.min(width * 0.82, 320) }]}>
            <Text style={styles.drawerTitle}>Exercises</Text>
            <ScrollView>
              {exercises.map((exercise) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: activeExercise === exercise.id,
                  }}
                  key={exercise.id}
                  onPress={() => {
                    onSelect(exercise.id);
                    setIsOpen(false);
                  }}
                  style={[
                    styles.exerciseButton,
                    activeExercise === exercise.id && styles.selectedExercise,
                  ]}
                >
                  <Text
                    style={[
                      styles.exerciseText,
                      activeExercise === exercise.id && styles.selectedText,
                    ]}
                  >
                    {exercise.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 16,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  menuButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  menuButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#111827",
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    flexDirection: "row",
    zIndex: 10,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
  },
  drawer: {
    backgroundColor: "#FFFFFF",
    elevation: 12,
    height: "100%",
    paddingHorizontal: 16,
    paddingTop: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  drawerTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  exerciseButton: {
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 12,
  },
  selectedExercise: {
    backgroundColor: "#DBEAFE",
  },
  exerciseText: {
    color: "#374151",
    fontSize: 15,
  },
  selectedText: {
    color: "#1D4ED8",
    fontWeight: "700",
  },
});
