import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type CarouselProps = {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  itemWidth?: number;
  gap?: number;
};

const Carousel = ({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showArrows = true,
  showDots = true,
  itemWidth = SCREEN_WIDTH - 40,
  gap = 16,
}: CarouselProps) => {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalItems = children.length;

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= totalItems) return;

    const offset = index * (itemWidth + gap);
    scrollViewRef.current?.scrollTo({ x: offset, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1 >= totalItems ? 0 : currentIndex + 1;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = currentIndex - 1 < 0 ? totalItems - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (itemWidth + gap));
    setCurrentIndex(index);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (itemWidth + gap));
    scrollToIndex(index);
  };

  // Auto play
  React.useEffect(() => {
    if (autoPlay) {
      autoPlayTimer.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1 >= totalItems ? 0 : prevIndex + 1;
          const offset = nextIndex * (itemWidth + gap);
          scrollViewRef.current?.scrollTo({ x: offset, animated: true });
          return nextIndex;
        });
      }, autoPlayInterval);

      return () => {
        if (autoPlayTimer.current) {
          clearInterval(autoPlayTimer.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, totalItems, itemWidth, gap]);

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        {showArrows && (
          <TouchableOpacity
            style={[
              styles.arrowButton,
              styles.leftArrow,
              { backgroundColor: colors.surface },
            ]}
            onPress={handlePrev}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={itemWidth + gap}
          snapToAlignment="start"
          contentContainerStyle={[styles.scrollContent, { gap }]}
        >
          {children.map((child, index) => (
            <View key={index} style={{ width: itemWidth }}>
              {child}
            </View>
          ))}
        </ScrollView>

        {showArrows && (
          <TouchableOpacity
            style={[
              styles.arrowButton,
              styles.rightArrow,
              { backgroundColor: colors.surface },
            ]}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {showDots && (
        <View style={styles.dotsContainer}>
          {children.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? colors.primary : colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default Carousel;
