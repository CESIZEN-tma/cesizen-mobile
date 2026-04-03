import Carousel from "@/components/shared/Carousel";
import PressButton from "@/components/shared/PressButton";
import { useTheme } from "@/hooks/themeHooks";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const slides = [
  {
    icon: "leaf-outline" as const,
    title: "Bienvenue sur CesiZen",
    description:
      "Prenez soin de votre bien-être mental grâce à des exercices de respiration guidés, conçus pour réduire le stress et l'anxiété.",
    bg: "#4ade80",
    iconColor: "#fff",
  },
  {
    icon: "clipboard-outline" as const,
    title: "Trouvez votre rythme",
    description:
      "Répondez à un court quiz et découvrez le pattern de respiration le plus adapté à vos besoins et à votre état du moment.",
    bg: "#60a5fa",
    iconColor: "#fff",
  },
  {
    icon: "body-outline" as const,
    title: "Respirez mieux",
    description:
      "Suivez des exercices de respiration guidés en temps réel — cohérence cardiaque, respiration 4-7-8, box breathing et bien d'autres.",
    bg: "#a78bfa",
    iconColor: "#fff",
  },
  {
    icon: "library-outline" as const,
    title: "Explorez les techniques",
    description:
      "Accédez à une bibliothèque complète de techniques de respiration et personnalisez vos configurations pour chaque exercice.",
    bg: "#fb923c",
    iconColor: "#fff",
  },
];

const firstOpenedPage = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { markAsLaunched } = useFirstLaunch();

  const handleContinueAsGuest = async () => {
    await markAsLaunched();
    router.replace("/(tabs)");
  };

  const handleCreateAccount = async () => {
    await markAsLaunched();
    router.push("/(auth)/register");
  };

  const handleLogin = async () => {
    await markAsLaunched();
    router.push("/(auth)/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Carousel
        autoPlay={false}
        autoPlayInterval={3000}
        showArrows={true}
        showDots={true}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { backgroundColor: slide.bg }]}>
            <View style={styles.iconWrapper}>
              <Ionicons name={slide.icon} size={64} color={slide.iconColor} />
            </View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>
          </View>
        ))}
      </Carousel>

      <View style={styles.buttonsContainer}>
        <PressButton
          label="Créer un compte"
          onPress={handleCreateAccount}
          width={300}
          height={48}
        />
        <PressButton
          label="Se connecter"
          secondary
          onPress={handleLogin}
          width={300}
          height={48}
        />
        <PressButton
          label="Continuer en tant qu'invité"
          secondary
          onPress={handleContinueAsGuest}
          width={300}
          height={48}
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
  slide: {
    height: 420,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 20,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  slideDescription: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginTop: 32,
    paddingBottom: 24,
  },
});
