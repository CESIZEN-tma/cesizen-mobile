import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import PageLayout from '@/components/PageLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTheme } from '@/hooks/themeHooks';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();

  const isDarkMode = theme === 'dark';

  return (
    <AuthGuard requireAuth={true}>
    <PageLayout header footer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Paramètres
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Apparence
            </Text>

            <View
              style={[
                styles.settingItem,
                { backgroundColor: colors.surface },
              ]}
            >
              <View style={styles.settingLeft}>
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={24}
                  color={colors.text}
                />
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Mode sombre
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Activez le thème sombre pour un meilleur confort visuel
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              À propos
            </Text>

            <View
              style={[
                styles.infoItem,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Version de l'application
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                1.0.0
              </Text>
            </View>
          </View>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
