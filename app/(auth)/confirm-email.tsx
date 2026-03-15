import PressButton from "@/components/shared/PressButton";
import Loader from "@/components/shared/Loader";
import { authApi } from "@/app/services/api/authApi";
import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const ConfirmEmail = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setError("Token de confirmation manquant");
        setIsLoading(false);
        return;
      }

      try {
        await authApi.confirmEmail(token);
        setSuccess(true);
      } catch (err: any) {
        console.error("Email confirmation failed:", err);
        setError(
          err?.message || "Échec de la confirmation. Le lien a peut-être expiré."
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
      >
        <Loader size={60} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Confirmation en cours...
        </Text>
      </View>
    );
  }

  if (success) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
      >
        <Ionicons
          name="checkmark-circle"
          size={100}
          color={colors.primary}
          style={styles.icon}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          Email confirmé !
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          Votre compte a été activé avec succès. Vous pouvez maintenant vous
          connecter.
        </Text>
        <PressButton
          label="Se connecter"
          onPress={() => router.replace("/(auth)/login")}
          width={300}
          height={50}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.centerContent,
        { backgroundColor: colors.background },
      ]}
    >
      <Ionicons
        name="close-circle"
        size={100}
        color={colors.error || "#ef4444"}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: colors.text }]}>
        Échec de la confirmation
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {error}
      </Text>
      <View style={styles.buttonGroup}>
        <PressButton
          label="Retour"
          onPress={() => router.replace("/(auth)/login")}
          width={300}
          height={50}
        />
      </View>
    </View>
  );
};

export default ConfirmEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 24,
  },
  buttonGroup: {
    gap: 16,
  },
});
