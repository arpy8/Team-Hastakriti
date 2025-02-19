import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, Platform, TextInput, Switch } from 'react-native';
import { Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function SecurityScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

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
          <Text style={styles.title}>Security</Text>
          <Text style={styles.subtitle}>Manage your account security settings</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Password</Text>
          <RNView style={styles.formGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor="#71717a"
            />
          </RNView>

          <RNView style={styles.formGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Enter new password"
              placeholderTextColor="#71717a"
            />
          </RNView>

          <RNView style={styles.formGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor="#71717a"
            />
          </RNView>

          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update Password</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
          <RNView style={styles.toggleOption}>
            <RNView style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Enable 2FA</Text>
              <Text style={styles.toggleDescription}>Add an extra layer of security to your account</Text>
            </RNView>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#27272a', true: '#06b6d4' }}
              thumbColor={twoFactorEnabled ? '#e2e2e5' : '#71717a'}
            />
          </RNView>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(300).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Biometric Authentication</Text>
          <RNView style={styles.toggleOption}>
            <RNView style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Enable Biometric Login</Text>
              <Text style={styles.toggleDescription}>Use fingerprint or face recognition to log in</Text>
            </RNView>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#27272a', true: '#06b6d4' }}
              thumbColor={biometricEnabled ? '#e2e2e5' : '#71717a'}
            />
          </RNView>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(400).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Login History</Text>
          <TouchableOpacity style={styles.historyButton}>
            <MaterialIcons name="history" size={20} color="#06b6d4" />
            <Text style={styles.historyButtonText}>View Login History</Text>
          </TouchableOpacity>
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#e2e2e5',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    color: '#e2e2e5',
    borderWidth: 1,
    borderColor: '#06b6d430',
    fontSize: 15,
  },
  updateButton: {
    backgroundColor: '#06b6d4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    color: '#09090b',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#e2e2e5',
    fontWeight: '500',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: '#94A3B8',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06b6d430',
  },
  historyButtonText: {
    color: '#e2e2e5',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
});