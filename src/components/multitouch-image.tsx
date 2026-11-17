import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useRotationGesture,
  useSimultaneousGestures,
} from "react-native-gesture-handler";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function MultitouchImage() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = usePanGesture({
    onUpdate: (event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    },
  });

  const pinchGesture = usePinchGesture({
    onUpdate: (event) => {
      scale.value = Math.max(0.5, Math.min(3, scale.value * event.scaleChange));
    },
  });

  const rotationGesture = useRotationGesture({
    onUpdate: (event) => {
      rotation.value += event.rotationChange;
    },
  });

  const gesture = useSimultaneousGestures(
    panGesture,
    pinchGesture,
    rotationGesture,
  );

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${(rotation.value * 180) / Math.PI}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <AnimatedImage
          source={require("../../assets/images/react-logo.png")}
          resizeMode="contain"
          style={[styles.image, imageStyle]}
        />
      </GestureDetector>
      <Text style={styles.hint}>Drag to move. Pinch to zoom. Twist to rotate.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    gap: 12,
    height: 240,
    justifyContent: "center",
    marginVertical: 20,
  },
  hint: {
    color: "#4B5563",
    fontSize: 13,
    textAlign: "center",
  },
  image: {
    height: 160,
    width: 160,
  },
});
