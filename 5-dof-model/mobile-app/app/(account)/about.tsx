import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, Platform, Linking } from 'react-native';
import { Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import Constants from 'expo-constants';

export default function AboutScreen() {
  const openPrivacyPolicy = () => {
    Linking.openURL('https://raw.githubusercontent.com/EpicShi/docs/refs/heads/main/privacy-policy.md');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://raw.githubusercontent.com/EpicShi/docs/refs/heads/main/terms-of-service.md');
  };

  const openContributors = () => {
    Linking.openURL('https://github.com/orgs/EpicShi/people');
  };

  return (
    <RNView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          entering={FadeInUp.springify()}
          style={styles.header}
        >
          {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#06b6d4" />
          </TouchableOpacity> */}
          <Text style={styles.title}>About</Text>
          <Text style={styles.subtitle}>App information and legal details</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>App Information</Text>
          <RNView style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{Constants.expoConfig?.version || '1.0.0'}</Text>
          </RNView>
          <RNView style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <Text style={styles.infoValue}>{Constants.expoConfig?.ios?.buildNumber || '1'}</Text>
          </RNView>
          <RNView style={styles.infoItem}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
          </RNView>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.legalButton} onPress={openPrivacyPolicy}>
            <MaterialIcons name="privacy-tip" size={20} color="#06b6d4" />
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={20} color="#71717a" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalButton} onPress={openTermsOfService}>
            <MaterialIcons name="description" size={20} color="#06b6d4" />
            <Text style={styles.legalButtonText}>Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={20} color="#71717a" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Credits</Text>
          <Text style={styles.creditText}>
            Hastakriti is developed and maintained by the Hastakriti team. Special thanks to our contributors and the open-source community.
          </Text>
          <TouchableOpacity style={styles.creditButton} onPress={openContributors}>
            <MaterialIcons name="people" size={20} color="#06b6d4" />
            <Text style={styles.creditButtonText}>View Contributors</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={[styles.section, styles.copyrightSection]}
        >
          <MaterialIcons name="copyright" size={20} color="#71717a" />
          <Text style={styles.copyrightText}>
            © 2025 Hastakriti. All rights reserved.
          </Text>
        </Animated.View>
      </ScrollView>
    </RNView>
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
    backgroundColor: '#09090b',
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
    marginBottom: 24,
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
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#06b6d430',
  },
  infoLabel: {
    fontSize: 15,
    color: '#e2e2e5',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#94A3B8',
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#06b6d430',
  },
  legalButtonText: {
    flex: 1,
    color: '#e2e2e5',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  creditText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  creditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06b6d430',
  },
  creditButtonText: {
    color: '#e2e2e5',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  copyrightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 12,
  },
  copyrightText: {
    fontSize: 14,
    color: '#71717a',
    marginLeft: 8,
  },
}); 