import Carousel from "@/components/shared/Carousel";
import PressButton from "@/components/shared/PressButton";
import { useTheme } from "@/hooks/themeHooks";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const firstOpenedPage = () => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Carousel
        autoPlay={false}
        autoPlayInterval={3000}
        showArrows={true}
        showDots={true}
      >
        {/* Slide 1 */}
        <View style={[styles.slide, { backgroundColor: colors.primary }]}>
          <Text style={styles.slideText}>Slide 1</Text>
        </View>

        {/* Slide 2 */}
        <View style={[styles.slide, { backgroundColor: colors.secondary }]}>
          <Text style={styles.slideText}>Slide 2</Text>
        </View>

        {/* Slide 3 */}
        <View style={[styles.slide, { backgroundColor: "#f59e0b" }]}>
          <Text style={styles.slideText}>Slide 3</Text>
        </View>

        {/* Slide avec image */}
        <View style={[styles.slide, { backgroundColor: colors.surface }]}>
          <Image
            source={{ uri: "https://picsum.photos/400/300" }}
            style={styles.image}
          />
          <Text style={[styles.slideText, { color: colors.text }]}>
            Image Slide
          </Text>
        </View>
      </Carousel>
      <View style={styles.buttonsContainer}>
        <PressButton
          label="Continuer en tant qu'invité"
          secondary
          onPress={() => router.push("/(tabs)")}
        />
        <PressButton
          label="Créer un compte"
          onPress={() => router.push("/(auth)/register")}
        />
      </View>
    </View>
  );
};

export default firstOpenedPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    marginTop: 30,
  },

  slide: {
    height: 500,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  slideText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
});
