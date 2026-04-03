import PressButton from "@/components/shared/PressButton";
import TextInput from "@/components/shared/forms/TextInput";
import { useAuth } from "@/hooks/useAuth";
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

const Register = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    };

    if (!formData.firstName) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword &&
      !newErrors.firstName &&
      !newErrors.lastName
    );
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        router.replace("/(auth)/confirm-account");
      } catch (error: any) {
        console.error("Registration failed:", error);
        const errorMessage =
          error?.message || "Échec de l'inscription. Veuillez réessayer.";
        setErrors({
          ...errors,
          email: errorMessage,
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

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Créer un compte
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Rejoignez-nous dès aujourd'hui
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <TextInput
                label="Prénom"
                placeholder="Jean"
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
                error={errors.firstName}
                icon="person-outline"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.nameInput}>
              <TextInput
                label="Nom"
                placeholder="Dupont"
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastName: text })
                }
                error={errors.lastName}
                icon="person-outline"
                autoCapitalize="words"
              />
            </View>
          </View>

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
            placeholder="Minimum 8 caractères"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            error={errors.password}
            icon="lock-closed-outline"
            isPassword
          />

          <TextInput
            label="Confirmer le mot de passe"
            placeholder="Retapez votre mot de passe"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
            error={errors.confirmPassword}
            icon="lock-closed-outline"
            isPassword
          />

          <View style={styles.buttonContainer}>
            <PressButton
              label={isLoading ? "Inscription..." : "S'inscrire"}
              onPress={isLoading ? () => {} : handleRegister}
              width={300}
              height={50}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Vous avez déjà un compte ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

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
  nameRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },
  nameInput: {
    flex: 1,
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
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
