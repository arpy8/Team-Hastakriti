import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, Platform, Linking } from 'react-native';
import { Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

type FAQItem = {
  question: string;
  answer: string;
  isExpanded: boolean;
};

export default function HelpSupportScreen() {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: 'How do I calibrate my prosthetic hand?',
      answer: 'To calibrate your prosthetic hand, ensure you\'re in a comfortable position and go to Settings > Calibration. Follow the step-by-step guide to set your comfortable range of motion and grip strength preferences.',
      isExpanded: false,
    },
    {
      question: 'What should I do if the prosthetic hand is not responding?',
      answer: 'First, check the battery level and ensure the device is properly connected. If connected, try recalibrating the sensors. If the issue persists, check for any physical obstructions in the joints and ensure the EMG sensors are properly placed.',
      isExpanded: false,
    },
    {
      question: 'How can I adjust the grip strength?',
      answer: 'Navigate to Settings > Hand Controls > Grip Strength to adjust the maximum force applied during different grip patterns. You can set different strength levels for various tasks like holding delicate objects or firmer grips.',
      isExpanded: false,
    },
    {
      question: 'How do I switch between different grip patterns?',
      answer: 'You can switch grip patterns either through the app\'s quick menu or by using programmed muscle signals. To customize these patterns, go to Settings > Grip Patterns and select your preferred activation method.',
      isExpanded: false,
    },
    {
      question: 'How often should I charge the prosthetic hand?',
      answer: 'We recommend charging the prosthetic hand every night. A full charge typically lasts 12-16 hours of normal use. You can check the current battery level in the app\'s dashboard or when the hand indicates low battery through vibration.',
      isExpanded: false,
    },
  ]);

  const toggleFAQ = (index: number) => {
    setFaqs(faqs.map((faq, i) => ({
      ...faq,
      isExpanded: i === index ? !faq.isExpanded : false,
    })));
  };

  const contactSupport = () => {
    Linking.openURL('mailto:arpitsengar99@gmail.com');
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
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>Get help and find answers to common questions</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity style={styles.supportButton} onPress={contactSupport}>
            <MaterialIcons name="email" size={20} color="#06b6d4" />
            <Text style={styles.supportButtonText}>Email Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportButton}>
            <MaterialIcons name="phone" size={20} color="#06b6d4" />
            <Text style={styles.supportButtonText}>Call Support</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(100 * (index + 1)).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.faqItem,
                  index !== faqs.length - 1 && styles.faqItemBorder
                ]}
                onPress={() => toggleFAQ(index)}
              >
                <RNView style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <MaterialIcons
                    name={faq.isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={24}
                    color="#06b6d4"
                  />
                </RNView>
                {faq.isExpanded && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(800).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <TouchableOpacity style={styles.resourceButton}>
            <MaterialIcons name="library-books" size={20} color="#06b6d4" />
            <Text style={styles.resourceButtonText}>User Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceButton}>
            <MaterialIcons name="video-library" size={20} color="#06b6d4" />
            <Text style={styles.resourceButtonText}>Video Tutorials</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(900).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => router.push('/(account)/privacy-policy')}
          >
            <MaterialIcons name="privacy-tip" size={20} color="#06b6d4" />
            <Text style={styles.resourceButtonText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => router.push('/(account)/terms-of-service')}
          >
            <MaterialIcons name="description" size={20} color="#06b6d4" />
            <Text style={styles.resourceButtonText}>Terms of Service</Text>
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
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#06b6d430',
  },
  supportButtonText: {
    color: '#e2e2e5',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  faqItem: {
    paddingVertical: 16,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#06b6d430',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    color: '#e2e2e5',
    fontWeight: '500',
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 20,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#06b6d430',
  },
  resourceButtonText: {
    color: '#e2e2e5',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
});