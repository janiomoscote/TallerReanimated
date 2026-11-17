import * as Device from "expo-device";
import { useState } from "react";
import { Button, Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { LoadingAnimation } from "@/components/loading-animation";
import { MultitouchImage } from "@/components/multitouch-image";
import { BounceShape } from "@/components/bounce-shape";
import { AnimatedCarousel } from "@/components/animated-carousel";
import { AccelerometerShape } from "@/components/accelerometer-shape";
import {
  ExerciseNavigation,
  type ExerciseId,
} from "@/components/exercise-navigation";
import { ThemedText } from "@/components/themed-text";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }

  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }

  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";

  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const [activeExercise, setActiveExercise] = useState<ExerciseId>("scale");
  const scale = useSharedValue(10); //Hook para animar el tamaño del cuadrado rojo
  const move = useSharedValue(0); //Hook para animar el movimiento del cuadrado azul
  const rotation = useSharedValue(0); //Hook para animar la rotación del cuadrado verde
  const translateX = useSharedValue(0); //Hook para animar la traslación en eje X del cuadrado negro
  const translateY = useSharedValue(0); //Hook para animar la traslación en eje Y del cuadrado negro
  const dragRotation = useSharedValue(0);
  const gesto = Gesture.Pan().onUpdate((e) => {
    translateX.value = e.translationX;
    translateY.value = e.translationY;
    dragRotation.value = e.translationX * 0.5;
  });

  const escala = useAnimatedStyle(() => ({
    width: scale.value,
    height: 200,
    backgroundColor: "red",
  }));

  const moveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: move.value }],
    width: 200,
    height: 200,
    backgroundColor: "blue",
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
    width: 200,
    height: 200,
    backgroundColor: "green",
  }));

  const dragTranslateGesture = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${dragRotation.value}deg` },
    ],
    elevation: 9,
    shadowRadius: 10,
    width: 200,
    height: 200,
    backgroundColor: "black",
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.screen}>
        <ExerciseNavigation
          activeExercise={activeExercise}
          onSelect={setActiveExercise}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
        >
          {activeExercise === "scale" && (
            <>
              <Animated.View
                style={[escala, { marginTop: 5, shadowRadius: 5 }]}
              />
              <Button
                title="Increase Scale"
                onPress={() => {
                  scale.set(scale.get() + 30);
                }}
              />
            </>
          )}
          {activeExercise === "move" && (
            <>
              <Animated.View style={[moveStyle, { marginTop: 20 }]} />
              <Button
                title="Scrawl and Move"
                onPress={() => {
                  move.set(move.get() + 20);
                }}
              />
            </>
          )}
          {activeExercise === "rotate" && (
            <>
              <Animated.View style={[rotateStyle, { marginTop: 20 }]} />
              <Button
                title="Rotate"
                onPress={() => {
                  rotation.set(withTiming(rotation.get() + 45));
                }}
              />
            </>
          )}
          {activeExercise === "drag" && (
            <GestureDetector gesture={gesto}>
              <Animated.View style={[dragTranslateGesture, { marginTop: 20 }]} />
            </GestureDetector>
          )}
          {activeExercise === "loading" && <LoadingAnimation />}
          {activeExercise === "multitouch" && <MultitouchImage />}
          {activeExercise === "bounce" && <BounceShape />}
          {activeExercise === "carousel" && <AnimatedCarousel />}
          {activeExercise === "accelerometer" && <AccelerometerShape />}
          {getDevMenuHint()}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
