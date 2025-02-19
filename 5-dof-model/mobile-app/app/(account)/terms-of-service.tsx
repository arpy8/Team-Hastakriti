import React from 'react';
import { StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function TermsOfServiceScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#06b6d4" />
          </TouchableOpacity>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.subtitle}>Last updated: February 2024</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using this application, you agree to be bound by these terms of service and all applicable laws and regulations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.text}>
            We grant you a personal, non-transferable license to use the application for controlling and managing your prosthetic hand device.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Disclaimer</Text>
          <Text style={styles.text}>
            The application is provided "as is" and we make no warranties regarding its functionality, reliability, or suitability for your specific needs.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#e2e2e5',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  section: {
    backgroundColor: '#18181b95',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#06b6d430',
    ...Platform.select({
      ios: {
        shadowColor: '#06b6d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e2e5',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
});
