import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, Platform, Switch } from 'react-native';
import { Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export default function NotificationsScreen() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive push notifications on your device',
      enabled: true,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: true,
    },
    {
      id: 'updates',
      title: 'App Updates',
      description: 'Get notified about new app updates',
      enabled: true,
    },
    {
      id: 'news',
      title: 'News & Announcements',
      description: 'Stay updated with latest news and announcements',
      enabled: true,
    },
    {
      id: 'schemes',
      title: 'Scheme Updates',
      description: 'Get notified about new government schemes',
      enabled: true,
    },
    {
      id: 'weather',
      title: 'Weather Alerts',
      description: 'Receive important weather alerts',
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
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
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Manage your notification preferences</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}
        >
          {settings.map((setting, index) => (
            <Animated.View
              key={setting.id}
              entering={FadeInUp.delay(100 * (index + 1)).springify()}
              style={[
                styles.settingItem,
                index !== settings.length - 1 && styles.settingItemBorder
              ]}
            >
              <RNView style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </RNView>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: '#27272a', true: '#06b6d4' }}
                thumbColor={setting.enabled ? '#e2e2e5' : '#71717a'}
              />
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(800).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Notification History</Text>
          <TouchableOpacity style={styles.historyButton}>
            <MaterialIcons name="notifications-none" size={20} color="#06b6d4" />
            <Text style={styles.historyButtonText}>View Notification History</Text>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#06b6d430',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    color: '#e2e2e5',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
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