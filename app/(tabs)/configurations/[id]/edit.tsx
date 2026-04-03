import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import PageLayout from '@/components/PageLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTheme } from '@/hooks/themeHooks';
import { useConfiguration } from '@/hooks/useConfiguration';
import ConfigurationForm from '@/components/configurations/ConfigurationForm';
import PressButton from '@/components/shared/PressButton';
import Loader from '@/components/shared/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UpdateConfigurationRequestDTO } from '@/app/services/api/types';
import { configurationApi } from '@/app/services/api/configurationApi';
import { Configuration } from '@/types/api.types';

export default function EditConfigurationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateConfiguration } = useConfiguration();

  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateConfigurationRequestDTO>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, [id]);

  const loadConfiguration = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const config = await configurationApi.getConfigurationById(id);
      setConfiguration(config);
      setFormData({
        name: config.name,
        inhalation: config.inhalation,
        retention1: config.retention1,
        exhalation: config.exhalation,
        retention2: config.retention2,
        durationMinutes: config.durationMinutes,
        difficulty: config.difficulty,
        objective: config.objective,
        guidanceType: config.guidanceType,
      });
    } catch (err: any) {
      console.error('Failed to load configuration:', err);
      setError('Impossible de charger la configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;

    if (formData.name && !formData.name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour la configuration');
      return;
    }

    if (formData.objective && !formData.objective.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un objectif pour la configuration');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateConfiguration(id, formData);
      Alert.alert(
        'Succès',
        'Configuration modifiée avec succès',
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
        error.message || 'Impossible de modifier la configuration'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout header footer>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.centerContainer}>
            <Loader size={60} />
          </View>
        </View>
      </PageLayout>
    );
  }

  if (error || !configuration) {
    return (
      <PageLayout header footer>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.centerContainer}>
            <Ionicons
              name="alert-circle"
              size={60}
              color={colors.error || '#ef4444'}
            />
            <Text style={[styles.errorText, { color: colors.text }]}>
              {error || 'Configuration introuvable'}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.backText, { color: colors.primary }]}>
                Retour
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </PageLayout>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <PageLayout header footer>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              Modifier Configuration
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
            label={isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
