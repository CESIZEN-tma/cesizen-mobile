import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import PageLayout from '@/components/PageLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTheme } from '@/hooks/themeHooks';
import TextInput from '@/components/shared/forms/TextInput';
import PressButton from '@/components/shared/PressButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authApi } from '@/app/services/api/authApi';

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Erreur',
        'Le nouveau mot de passe et sa confirmation ne correspondent pas'
      );
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir au moins 8 caractères'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.changePassword(oldPassword, newPassword);

      Alert.alert('Succès', 'Mot de passe modifié avec succès', [
        {
          text: 'OK',
          onPress: () => {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de modifier le mot de passe'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
    <PageLayout header footer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Changer le mot de passe
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>
              Mot de passe actuel
            </Text>
            <TextInput
              placeholder="Mot de passe actuel"
              value={oldPassword}
              onChangeText={(text: string) => setOldPassword(text)}
              secureTextEntry
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>
              Nouveau mot de passe
            </Text>
            <TextInput
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChangeText={(text: string) => setNewPassword(text)}
              secureTextEntry
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>
              Confirmer le nouveau mot de passe
            </Text>
            <TextInput
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChangeText={(text: string) => setConfirmPassword(text)}
              secureTextEntry
            />
          </View>

          <View
            style={[
              styles.infoBox,
              { backgroundColor: colors.surface, borderColor: colors.primary },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Le mot de passe doit contenir au moins 8 caractères
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PressButton
            label={isSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
            onPress={isSubmitting ? () => {} : handleSubmit}
            width={320}
            height={56}
          />
        </View>
      </View>
      </PageLayout>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});
