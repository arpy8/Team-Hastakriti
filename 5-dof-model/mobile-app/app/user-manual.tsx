import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Section = {
  title: string;
  content: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const manualSections: Section[] = [
  {
    title: 'Getting Started',
    icon: 'play-circle-outline',
    content: `1. Ensure your prosthetic device is charged
2. Turn on the device using the power button
3. Connect to the device via Bluetooth
4. Calibrate the device using the settings menu
5. You're ready to use your prosthetic hand!`
  },
  {
    title: 'Basic Controls',
    icon: 'touch-app',
    content: `• Open/Close: Use the main grip button
• Grip Force: Adjust using the force slider
• Grip Modes: Switch between different preset grips
• Emergency Stop: Double tap the power button
• Sleep Mode: Hold power button for 3 seconds`
  },
  {
    title: 'Grip Patterns',
    icon: 'pan-tool',
    content: `Available grip patterns:
1. Power Grip - For larger objects
2. Precision Grip - For small items
3. Key Grip - For thin objects
4. Tripod Grip - For picking small items
5. Hook Grip - For carrying bags`
  },
  {
    title: 'Maintenance',
    icon: 'build',
    content: `Regular maintenance checklist:
• Clean the device weekly
• Check for loose components
• Calibrate monthly
• Update firmware when available
• Replace battery every 2 years`
  },
  {
    title: 'Troubleshooting',
    icon: 'help-outline',
    content: `Common issues:
1. Device not responding
   - Check battery level
   - Restart the device
2. Connection issues
   - Ensure Bluetooth is enabled
   - Try re-pairing
3. Unresponsive grips
   - Recalibrate the device
   - Check for obstructions`
  }
];

const ManualSection = ({ section, isExpanded, onPress }: { 
  section: Section, 
  isExpanded: boolean, 
  onPress: () => void 
}) => (
  <View style={[styles.sectionContainer, { backgroundColor: '#18181B95' }]}>
    <TouchableOpacity onPress={onPress} style={styles.sectionHeader}>
      <View style={[styles.iconContainer, { backgroundColor: '#06B6D420' }]}>
        <MaterialIcons name={section.icon} size={24} color="#06B6D4" />
      </View>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <MaterialIcons 
        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
        size={24} 
        color="#06B6D4" 
      />
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.sectionContent}>
        <Text style={styles.content}>{section.content}</Text>
      </View>
    )}
  </View>
);

export default function UserManualScreen() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#06B6D4" />
          </TouchableOpacity>
          <Text style={styles.title}>User Manual</Text>
        </View>
        {manualSections.map((section, index) => (
          <ManualSection
            key={section.title}
            section={section}
            isExpanded={expandedSection === index}
            onPress={() => setExpandedSection(expandedSection === index ? null : index)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  mainContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#18181B95',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#06B6D4',
  },
  sectionContainer: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06B6D430',
    overflow: 'hidden',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  content: {
    fontSize: 14,
    lineHeight: 24,
    color: '#94A3B8',
  },
});
