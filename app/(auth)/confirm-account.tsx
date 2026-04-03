import PressButton from "@/components/shared/PressButton";
import TextInput from "@/components/shared/forms/TextInput";
import { authApi } from "@/app/services/api/authApi";
import secureStoreService from "@/app/services/secureStore.service";
import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ConfirmAccount = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setConfirmError(null);

    try {
      await authApi.confirmEmail(code.trim());
      await secureStoreService.removeItem('pendingConfirmationAt');
      router.replace("/(auth)/login");
    } catch {
      setConfirmError("Erreur lors de la confirmation du compte");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Confirmer votre compte
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Entrez le code à 6 chiffres reçu par email
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Code de confirmation"
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            icon="key-outline"
            keyboardType="number-pad"
            autoCapitalize="none"
            maxLength={6}
          />

          {confirmError && (
            <Text style={[styles.errorText, { color: colors.error || "#ef4444" }]}>
              {confirmError}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <PressButton
              label={isLoading ? "Confirmation..." : "Confirmer"}
              onPress={isLoading ? () => {} : handleConfirm}
              width={300}
              height={50}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 24,
    padding: 8,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: "100%",
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
});
