import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, Platform, TextInput } from 'react-native';
import { Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import user from '@/constants/UserData';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function PersonalInformationScreen() {
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
          <Text style={styles.title}>Personal Information</Text>
          <Text style={styles.subtitle}>Update your personal details</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}
        >
          <RNView style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              placeholderTextColor="#71717a"
            />
          </RNView>

          <RNView style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              keyboardType="email-address"
              placeholderTextColor="#71717a"
            />
          </RNView>

          <RNView style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={user.phone}
              keyboardType="phone-pad"
              placeholderTextColor="#71717a"
            />
          </RNView>

          <RNView style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={user.address}
              multiline
              numberOfLines={3}
              placeholderTextColor="#71717a"
            />
          </RNView>
        </Animated.View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#06b6d4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#09090b',
    fontSize: 16,
    fontWeight: '600',
  },
});