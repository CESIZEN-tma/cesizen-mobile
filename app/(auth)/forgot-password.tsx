import PressButton from "@/components/shared/PressButton";
import TextInput from "@/components/shared/forms/TextInput";
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

const ForgotPassword = () => {
  const { colors } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError("L'email est requis");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email invalide");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (validateEmail()) {
      console.log("Reset password for:", email);
      setSubmitted(true);
      // Handle password reset logic here
    }
  };

  if (submitted) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.successContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={64}
              color={colors.primary}
            />
          </View>

          <Text style={[styles.successTitle, { color: colors.text }]}>
            Email envoyé !
          </Text>

          <Text
            style={[styles.successMessage, { color: colors.textSecondary }]}
          >
            Nous avons envoyé un lien de réinitialisation à
          </Text>

          <Text style={[styles.emailText, { color: colors.text }]}>
            {email}
          </Text>

          <Text
            style={[styles.successMessage, { color: colors.textSecondary }]}
          >
            Vérifiez votre boîte de réception et suivez les instructions pour
            réinitialiser votre mot de passe.
          </Text>

          <View style={styles.buttonContainer}>
            <PressButton
              label="Retour à la connexion"
              onPress={() => router.push("/(auth)/login")}
              width={300}
              height={50}
            />
          </View>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => setSubmitted(false)}
          >
            <Text style={[styles.resendText, { color: colors.primary }]}>
              Renvoyer l'email
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Mot de passe oublié ?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Entrez votre email et nous vous enverrons un lien pour réinitialiser
            votre mot de passe.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="votre.email@exemple.com"
            value={email}
            onChangeText={setEmail}
            error={error}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.buttonContainer}>
            <PressButton
              label="Envoyer le lien"
              onPress={handleSubmit}
              width={300}
              height={50}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Retour à la connexion
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  resendButton: {
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
