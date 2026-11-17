import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function LoadingAnimation() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1600 }), -1);
  }, [progress]);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 360}deg` }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container} accessibilityLabel="Loading">
      <Animated.View style={[styles.spinner, spinnerStyle]} />
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    gap: 16,
    marginVertical: 20,
    maxWidth: 280,
    width: "100%",
  },
  spinner: {
    alignSelf: "center",
    borderColor: "#D1D5DB",
    borderRadius: 20,
    borderTopColor: "#2563EB",
    borderWidth: 4,
    height: 40,
    width: 40,
  },
  progressTrack: {
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    height: 8,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    backgroundColor: "#2563EB",
    height: "100%",
  },
});
