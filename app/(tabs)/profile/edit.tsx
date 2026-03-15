import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import PageLayout from '@/components/PageLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTheme } from '@/hooks/themeHooks';
import { useAuth } from '@/hooks/useAuth';
import TextInput from '@/components/shared/forms/TextInput';
import PressButton from '@/components/shared/PressButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { userApi } from '@/app/services/api/userApi';
import secureStoreService from '@/app/services/secureStore.service';

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { user, checkAuthStatus } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedProfile = await userApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      await secureStoreService.saveUser({
        email: updatedProfile.email,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
      });

      await checkAuthStatus();

      Alert.alert('Succès', 'Profil modifié avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de modifier le profil'
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
            Modifier le profil
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Prénom</Text>
            <TextInput
              placeholder="Prénom"
              value={firstName}
              onChangeText={(text: string) => setFirstName(text)}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>
              Nom de famille
            </Text>
            <TextInput
              placeholder="Nom de famille"
              value={lastName}
              onChangeText={(text: string) => setLastName(text)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PressButton
            label={isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
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
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});
