import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/themeHooks';
import TextInput from '@/components/shared/forms/TextInput';
import Slider from '@react-native-community/slider';
import { CreateConfigurationRequestDTO } from '@/app/services/api/types';

interface ConfigurationFormProps {
  initialValues?: Partial<CreateConfigurationRequestDTO>;
  onValuesChange?: (values: CreateConfigurationRequestDTO) => void;
}

export default function ConfigurationForm({
  initialValues,
  onValuesChange,
}: ConfigurationFormProps) {
  const { colors } = useTheme();

  const [formData, setFormData] = useState<CreateConfigurationRequestDTO>({
    name: initialValues?.name || '',
    inhalation: initialValues?.inhalation || 4,
    retention1: initialValues?.retention1 || 4,
    exhalation: initialValues?.exhalation || 4,
    retention2: initialValues?.retention2 || 4,
    durationMinutes: initialValues?.durationMinutes || 5,
    difficulty: initialValues?.difficulty || 3,
    objective: initialValues?.objective || 'Relaxation',
    guidanceType: initialValues?.guidanceType || 'visual',
  });

  const updateField = (field: keyof CreateConfigurationRequestDTO, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onValuesChange) {
      onValuesChange(newData);
    }
  };

  const guidanceTypes = [
    { value: 'visual', label: 'Visuel' },
    { value: 'audio', label: 'Audio' },
    { value: 'haptic', label: 'Haptique' },
    { value: 'combined', label: 'Combiné' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Nom de la configuration
        </Text>
        <TextInput
          placeholder="Ma configuration personnalisée"
          value={formData.name}
          onChangeText={(text: string) => updateField('name', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Objectif
        </Text>
        <TextInput
          placeholder="Relaxation, Concentration, Énergie..."
          value={formData.objective}
          onChangeText={(text: string) => updateField('objective', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Inhalation: {formData.inhalation}s
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={formData.inhalation}
          onValueChange={(value) => updateField('inhalation', value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Rétention 1: {formData.retention1}s
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={formData.retention1}
          onValueChange={(value) => updateField('retention1', value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Exhalation: {formData.exhalation}s
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={formData.exhalation}
          onValueChange={(value) => updateField('exhalation', value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Rétention 2: {formData.retention2}s
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={formData.retention2}
          onValueChange={(value) => updateField('retention2', value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Durée totale: {formData.durationMinutes} min
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={formData.durationMinutes}
          onValueChange={(value) => updateField('durationMinutes', value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Difficulté: {formData.difficulty}/5
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={formData.difficulty}
          onValueChange={(value) => updateField('difficulty', value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          Type de guidance
        </Text>
        <View style={styles.guidanceTypeContainer}>
          {guidanceTypes.map((type) => (
            <View
              key={type.value}
              style={[
                styles.guidanceTypeButton,
                {
                  backgroundColor:
                    formData.guidanceType === type.value
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.primary,
                },
              ]}
              onTouchEnd={() => updateField('guidanceType', type.value)}
            >
              <Text
                style={[
                  styles.guidanceTypeText,
                  {
                    color:
                      formData.guidanceType === type.value
                        ? '#ffffff'
                        : colors.text,
                  },
                ]}
              >
                {type.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.previewSection}>
        <Text style={[styles.previewTitle, { color: colors.text }]}>
          Aperçu du cycle
        </Text>
        <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.previewText, { color: colors.text }]}>
            {formData.inhalation}s inspire → {formData.retention1}s retient →{' '}
            {formData.exhalation}s expire → {formData.retention2}s retient
          </Text>
          <Text style={[styles.previewText, { color: colors.textSecondary }]}>
            Cycle complet:{' '}
            {formData.inhalation +
              formData.retention1 +
              formData.exhalation +
              formData.retention2}
            s
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  guidanceTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  guidanceTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  guidanceTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewCard: {
    padding: 16,
    borderRadius: 8,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
