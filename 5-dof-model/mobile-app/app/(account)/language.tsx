import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
// import { useLanguageStore, getAvailableLanguages } from '@/stores/languageStore';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

export default function LanguageScreen() {
  // const { currentLanguage, setLanguage } = useLanguageStore();
  // const languages = getAvailableLanguages();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View 
          entering={FadeInUp.springify()}
          style={styles.header}
        >
          <Text style={styles.title}>Language</Text>
          <Text style={styles.subtitle}>Select your preferred language</Text>
        </Animated.View>

        <View style={styles.languageList}>
          {languages.map((language, index) => (
            <Animated.View
              key={language.code}
              entering={FadeInUp.delay(100 * index).springify()}
              layout={Layout.springify()}
            >
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  currentLanguage.code === language.code && styles.selectedOption
                ]}
                onPress={() => setLanguage(language)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.nativeName}>{language.nativeName}</Text>
                </View>
                {currentLanguage.code === language.code && (
                  <MaterialIcons name="check" size={24} color="#06B6D4" />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
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
  content: {
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
  languageList: {
    gap: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181b95',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#06B6D430',
  },
  selectedOption: {
    borderColor: '#06B6D4',
    backgroundColor: '#18181b',
  },
  languageInfo: {
    backgroundColor: 'transparent',
  },
  languageName: {
    fontSize: 16,
    color: '#e2e2e5',
    fontWeight: '500',
  },
  nativeName: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
