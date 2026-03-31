import PressButton from "@/components/shared/PressButton";
import TextInput from "@/components/shared/forms/TextInput";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const Login = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { login } = useAuth();
  const { notice } = useLocalSearchParams<{ notice?: string }>();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await login(formData.email, formData.password);
        router.replace("/(tabs)");
      } catch (error: any) {
        console.error("Login failed:", error);

        let errorMessage = "Échec de la connexion. Veuillez réessayer.";

        if (error?.message) {
          if (error.message.toLowerCase().includes("not activated") ||
              error.message.toLowerCase().includes("non activé")) {
            errorMessage = "Compte non activé. Veuillez vérifier votre email.";
          } else if (error.message.toLowerCase().includes("locked") ||
                     error.message.toLowerCase().includes("verrouillé")) {
            errorMessage = "Compte verrouillé. Contactez le support.";
          } else if (error.message.toLowerCase().includes("credentials") ||
                     error.message.toLowerCase().includes("email") ||
                     error.message.toLowerCase().includes("password")) {
            errorMessage = "Email ou mot de passe incorrect.";
          }
        }

        setErrors({
          ...errors,
          password: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
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
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {notice ? (
          <View style={[styles.noticeBanner, { backgroundColor: colors.primary + "20", borderColor: colors.primary }]}>
            <Ionicons name="mail-outline" size={18} color={colors.primary} style={styles.noticeIcon} />
            <Text style={[styles.noticeText, { color: colors.primary }]}>{notice}</Text>
          </View>
        ) : null}

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Bon retour !
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Connectez-vous à votre compte
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="votre.email@exemple.com"
            value={formData.email}
            onChangeText={(text) =>
              setFormData({ ...formData, email: text })
            }
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            error={errors.password}
            icon="lock-closed-outline"
            isPassword
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <PressButton
              label={isLoading ? "Connexion..." : "Se connecter"}
              onPress={isLoading ? () => {} : handleLogin}
              width={300}
              height={50}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Vous n'avez pas de compte ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                S'inscrire
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
  noticeBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 80,
    marginBottom: -16,
    gap: 8,
  },
  noticeIcon: {
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  header: {
    marginBottom: 40,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
