import { StyleSheet, Text } from "react-native";
import {
  GestureDetector,
  useTapGesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function BounceShape() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const tapGesture = useTapGesture({
    onBegin: () => {
      "worklet";
      scale.set(withTiming(0.8, { duration: 100 }));
    },
    onFinalize: () => {
      "worklet";
      scale.set(withSpring(1, { damping: 5, stiffness: 200 }));
    },
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        accessibilityHint="Press and release to see the bounce animation."
        accessibilityLabel="Bounce animation shape"
        accessibilityRole="button"
        style={[styles.shape, animatedStyle]}
      >
        <Text style={styles.label}>Press me</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  shape: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 16,
    height: 110,
    justifyContent: "center",
    marginVertical: 20,
    width: 110,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
