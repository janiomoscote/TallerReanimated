import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

type CarouselItem = {
  title: string;
  description: string;
  color: string;
};

const items: CarouselItem[] = [
  {
    title: "Discover",
    description: "Explore new ideas and places.",
    color: "#2563EB",
  },
  {
    title: "Create",
    description: "Bring your next idea to life.",
    color: "#7C3AED",
  },
  {
    title: "Connect",
    description: "Share what matters with others.",
    color: "#DB2777",
  },
  {
    title: "Grow",
    description: "Keep learning at your own pace.",
    color: "#059669",
  },
];

type CarouselCardProps = {
  index: number;
  item: CarouselItem;
  interval: number;
  width: number;
  scrollX: SharedValue<number>;
};

function CarouselCard({
  index,
  item,
  interval,
  width,
  scrollX,
}: CarouselCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = index * interval - scrollX.value;

    return {
      transform: [
        {
          scale: interpolate(
            distance,
            [-interval, 0, interval],
            [0.84, 1, 0.84],
            Extrapolation.CLAMP,
          ),
        },
        {
          rotateZ: `${interpolate(
            distance,
            [-interval, 0, interval],
            [-8, 0, 8],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.card, { backgroundColor: item.color, width }, animatedStyle]}
    >
      <Text style={styles.cardIndex}>0{index + 1}</Text>
      <View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </Animated.View>
  );
}

export function AnimatedCarousel() {
  const { width: screenWidth } = useWindowDimensions();
  const availableWidth = Math.max(screenWidth - 32, 0);
  const cardWidth = Math.min(availableWidth * 0.78, 320);
  const gap = 16;
  const interval = cardWidth + gap;
  const sidePadding = (availableWidth - cardWidth) / 2;
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Animated Carousel</Text>
      <Text style={styles.hint}>Swipe horizontally to explore</Text>
      <Animated.ScrollView
        horizontal
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        contentContainerStyle={[styles.cards, { gap, paddingHorizontal: sidePadding }]}
      >
        {items.map((item, index) => (
          <CarouselCard
            key={item.title}
            index={index}
            interval={interval}
            item={item}
            scrollX={scrollX}
            width={cardWidth}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  heading: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  hint: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  cards: {
    alignItems: "center",
  },
  card: {
    borderRadius: 24,
    height: 220,
    justifyContent: "space-between",
    padding: 24,
  },
  cardIndex: {
    color: "#FFFFFFB3",
    fontSize: 14,
    fontWeight: "600",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardDescription: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
