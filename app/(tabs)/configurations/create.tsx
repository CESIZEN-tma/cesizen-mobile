import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import PageLayout from '@/components/PageLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTheme } from '@/hooks/themeHooks';
import { useConfiguration } from '@/hooks/useConfiguration';
import ConfigurationForm from '@/components/configurations/ConfigurationForm';
import PressButton from '@/components/shared/PressButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CreateConfigurationRequestDTO } from '@/app/services/api/types';

export default function CreateConfigurationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { createConfiguration } = useConfiguration();

  const [formData, setFormData] = useState<CreateConfigurationRequestDTO>({
    name: '',
    inhalation: 4,
    retention1: 4,
    exhalation: 4,
    retention2: 4,
    durationMinutes: 5,
    difficulty: 3,
    objective: 'Relaxation',
    guidanceType: 'visual',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour la configuration');
      return;
    }

    if (!formData.objective.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un objectif pour la configuration');
      return;
    }

    try {
      setIsSubmitting(true);
      const newConfig = await createConfiguration(formData);
      Alert.alert(
        'Succès',
        'Configuration créée avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de créer la configuration'
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
            Nouvelle Configuration
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <ConfigurationForm
            initialValues={formData}
            onValuesChange={setFormData}
          />
        </View>

        <View style={styles.buttonContainer}>
          <PressButton
            label={isSubmitting ? 'Création...' : 'Créer la configuration'}
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
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});
