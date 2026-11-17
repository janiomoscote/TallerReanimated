import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Accelerometer } from "expo-sensors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type SensorStatus =
  | "checking"
  | "ready"
  | "needs-permission"
  | "permission-denied"
  | "unavailable"
  | "error";

export function AccelerometerShape() {
  const [shakeCount, setShakeCount] = useState(0);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>(
    Platform.OS === "web" ? "needs-permission" : "checking",
  );
  const shake = useSharedValue(0);
  const mounted = useRef(false);
  const previous = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastShakeAt = useRef(0);
  const subscription = useRef<ReturnType<typeof Accelerometer.addListener> | null>(
    null,
  );

  const handleMeasurement = useCallback(
    ({ x, y, z }: { x: number; y: number; z: number }) => {
      const last = previous.current;
      previous.current = { x, y, z };

      if (last) {
        const change = Math.hypot(x - last.x, y - last.y, z - last.z);
        const now = Date.now();

        if (change > 0.25 && now - lastShakeAt.current > 350) {
          lastShakeAt.current = now;
          setShakeCount((count) => count + 1);
        }
      }
    },
    [],
  );

  const subscribeToSensor = useCallback(() => {
    Accelerometer.setUpdateInterval(50);
    subscription.current?.remove();
    previous.current = null;
    subscription.current = Accelerometer.addListener(handleMeasurement);
  }, [handleMeasurement]);

  const requestMotionAccess = useCallback(async () => {
    try {
      const permission = await Accelerometer.requestPermissionsAsync();
      if (!mounted.current) {
        return;
      }
      if (!permission.granted) {
        setSensorStatus("permission-denied");
        return;
      }

      const isAvailable = await Accelerometer.isAvailableAsync();
      if (!mounted.current) {
        return;
      }
      if (!isAvailable) {
        setSensorStatus("unavailable");
        return;
      }

      subscribeToSensor();
      setSensorStatus("ready");
    } catch (error) {
      console.error("Unable to start the accelerometer.", error);
      if (mounted.current) {
        setSensorStatus("error");
      }
    }
  }, [subscribeToSensor]);

  useEffect(() => {
    mounted.current = true;
    if (Platform.OS !== "web") {
      Accelerometer.isAvailableAsync()
        .then((isAvailable) => {
          if (!mounted.current) {
            return;
          }
          if (!isAvailable) {
            setSensorStatus("unavailable");
            return;
          }

          subscribeToSensor();
          setSensorStatus("ready");
        })
        .catch((error: unknown) => {
          console.error("Unable to check accelerometer availability.", error);
          if (mounted.current) {
            setSensorStatus("error");
          }
        });
    }

    return () => {
      mounted.current = false;
      subscription.current?.remove();
      subscription.current = null;
    };
  }, [subscribeToSensor]);

  useEffect(() => {
    if (shakeCount === 0) {
      return;
    }

    shake.value = withSequence(
      withTiming(-12, { duration: 55 }),
      withTiming(12, { duration: 55 }),
      withTiming(-9, { duration: 55 }),
      withTiming(9, { duration: 55 }),
      withSpring(0, { damping: 5, stiffness: 180 }),
    );
  }, [shake, shakeCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shake.value },
      { rotateZ: `${shake.value * 0.6}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>
        {sensorStatus === "ready" && "Shake your device"}
        {sensorStatus === "checking" && "Checking accelerometer..."}
        {sensorStatus === "needs-permission" &&
          "Enable motion access to use the accelerometer"}
        {sensorStatus === "permission-denied" &&
          "Motion access was denied. Enable it in browser settings."}
        {sensorStatus === "unavailable" &&
          "Accelerometer is unavailable on this device"}
        {sensorStatus === "error" && "Unable to start the accelerometer"}
      </Text>
      {sensorStatus === "needs-permission" && (
        <Pressable
          accessibilityRole="button"
          onPress={() => void requestMotionAccess()}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Enable motion access</Text>
        </Pressable>
      )}
      <Animated.View style={[styles.shape, animatedStyle]}>
        <Text style={styles.shapeLabel}>Shake me</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    justifyContent: "center",
    marginVertical: 20,
    minHeight: 180,
  },
  hint: {
    color: "#4B5563",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  shape: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 16,
    height: 88,
    justifyContent: "center",
    width: 88,
  },
  shapeLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
