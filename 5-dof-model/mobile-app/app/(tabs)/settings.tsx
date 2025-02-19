import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View as RNView, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import user from '@/constants/UserData';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { router } from 'expo-router';

type MenuItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description?: string;
  onPress?: () => void;
  index: number;
};

type ScreenRoute = 
  | '/(account)/personal-information'
  | '/(account)/security'
  | '/(account)/notifications'
  | '/(account)/help-support'
  | '/(account)/about'
  | '/(account)/language';  // Add this line

const MenuItem = ({ icon, label, description, onPress, index }: MenuItemProps) => (
  <Animated.View
    entering={FadeInUp.delay(100 * index).springify()}
    layout={Layout.springify()}
  >
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <RNView style={styles.optionContent}>
        <RNView style={styles.iconContainer}>
          <MaterialIcons name={icon} size={20} color="#06B6D4" />
        </RNView>
        <RNView style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
          {description && <Text style={styles.optionDescription}>{description}</Text>}
        </RNView>
      </RNView>
      <MaterialIcons name="chevron-right" size={20} color="#71717a" />
    </TouchableOpacity>
  </Animated.View>
);

export default function SettingsScreen() {
  const navigateToScreen = (screen: ScreenRoute) => {
    router.push(screen);
  };

  return (
    <RNView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          entering={FadeInUp.springify()}
          style={styles.header}
        >
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>Manage your account settings and preferences</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.card}
        >
          <RNView style={styles.profileImageContainer}>
            <Image source={user.image} style={styles.profileImage} />
            <RNView style={styles.badgeContainer}>
              <MaterialIcons name="verified" size={24} color="#06B6D4" />
            </RNView>
          </RNView>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigateToScreen('/(account)/personal-information')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <MenuItem 
            icon="account-circle" 
            label="Personal Information" 
            description="Update your personal details"
            onPress={() => navigateToScreen('/(account)/personal-information')}
            index={0}
          />
          <MenuItem 
            icon="security" 
            label="Security" 
            description="Password and authentication"
            onPress={() => navigateToScreen('/(account)/security')}
            index={1}
          />
          <MenuItem 
            icon="notifications" 
            label="Notifications" 
            description="Manage notification preferences"
            onPress={() => navigateToScreen('/(account)/notifications')}
            index={2}
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(300).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Preferences</Text>
          <MenuItem 
            icon="language" 
            label="Language" 
            description="Change app language"
            onPress={() => navigateToScreen('/(account)/language')}
            index={3}
          />
          <MenuItem 
            icon="help-outline" 
            label="Help & Support" 
            description="Get help or contact us"
            onPress={() => navigateToScreen('/(account)/help-support')}
            index={4}
          />
          <MenuItem 
            icon="info-outline" 
            label="About" 
            description="App version and information"
            onPress={() => navigateToScreen('/(account)/about')}
            index={5}
          />
        </Animated.View>
      </ScrollView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    padding: 16,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    backgroundColor: '#09090b',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#e2e2e5',
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#18181b95',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#06B6D430',
    ...Platform.select({
      ios: {
        shadowColor: '#06B6D4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#06B6D430',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#18181b95',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#06B6D430',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e2e2e5',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: '#27272a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06B6D430',
  },
  editProfileText: {
    color: '#e2e2e5',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#09090b',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#71717a', 
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b95',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#06B6D430',
    ...Platform.select({
      ios: {
        shadowColor: '#06B6D4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 15,
    color: '#e2e2e5',
    fontWeight: '500',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: '#94A3B8',
  },
});