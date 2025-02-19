import React, { useRef, useState } from 'react';
import user from '@/constants/UserData';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import {WS_URL} from '@/context/WebSocketContext';

const deviceStats = {
  batteryLevel: '85%',
  upcomingMaintenance: 'Firmware Update - 15th Feb',
};

export default function HomePage() {
  const router = useRouter();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnection = () => {
    if (isConnected && ws.current) {
      ws.current.close();
      return;
    }

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('Connected to ESP8266');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      console.log('Received from ESP8266:', event.data);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from ESP8266');
      setIsConnected(false);
    };
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#09090B' }]}>
      <View style={styles.mainContainer}>
        <View style={[styles.welcomeContainer, { backgroundColor: '#18181B95' }]}>
          <View style={[styles.logoContainer, { backgroundColor: '#27272A' }]}>
            <Image
              source={require('@/assets/images/icons/icon.png')}
              style={styles.logo}
            />
          </View>
          <View style={[styles.welcomeTextContainer, { backgroundColor: 'transparent' }]}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        </View>

        {/* Device Statistics */}
        <View style={[styles.statsGrid, { backgroundColor: 'transparent' }]}>
          <View style={[styles.statsCard, { backgroundColor: '#18181B95' }]}>
            <MaterialIcons name="battery-charging-full" size={24} color="#06B6D4" />
            <Text style={styles.statsValue}>{deviceStats.batteryLevel}</Text>
            <Text style={styles.statsLabel}>Battery Level</Text>
          </View>
          <TouchableOpacity 
            style={[styles.statsCard, { backgroundColor: '#18181B95' }]} 
            onPress={handleConnection}
          >
            <MaterialIcons name="wifi" size={24} color={isConnected ? "#06B6D4" : "#94A3B8"} />
            <Text style={[styles.statsValue, { color: isConnected ? "#06B6D4" : "#94A3B8" }]}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
            <Text style={styles.statsLabel}>Connectivity</Text>
          </TouchableOpacity>
          <View style={[styles.statsCard, { backgroundColor: '#18181B95' }]}>
            <MaterialIcons name="history" size={24} color="#06B6D4" />
            <Text style={styles.statsValue}>{isConnected ? 'Active' : 'Inactive'}</Text>
            <Text style={styles.statsLabel}>Recent Activity</Text>
          </View>
        </View>

        {/* Quick Access Buttons */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={[styles.quickAccessContainer, { backgroundColor: 'transparent' }]}>
          <TouchableOpacity
            style={[styles.quickAccessButton, { backgroundColor: '#18181B95' }]}
            onPress={() => { router.push('/(tabs)/settings') }}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="settings" size={24} color="#06B6D4" />
            </View>
            <Text style={styles.quickAccessText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessButton, { backgroundColor: '#18181B95' }]}
            onPress={() => { router.push('/user-manual') }}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="book" size={24} color="#06B6D4" />
            </View>
            <Text style={styles.quickAccessText}>Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessButton, { backgroundColor: '#18181B95' }]}
            // onPress={() => { router.push('/user-manual') }}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="update" size={24} color="#06B6D4" />
            </View>
            <Text style={styles.quickAccessText}>Update Firmware</Text>
          </TouchableOpacity>
        </View>

        {/* Latest News */}
        <Text style={styles.sectionTitle}>Latest Updates</Text>
        <View style={[styles.newsContainer, { backgroundColor: '#18181B95' }]}>
          <View style={[styles.newsHeader, { backgroundColor: 'transparent' }]}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="event" size={24} color="#06B6D4" />
            </View>
            <Text style={styles.newsTitle}>{deviceStats.upcomingMaintenance}</Text>
          </View>
          <Text style={styles.newsDescription}>
            Don't miss the firmware update scheduled for 15th February. Ensure your device is up-to-date with the latest features and improvements.
          </Text>
        </View>
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
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#06B6D430',
    ...Platform.select({
      ios: {
        shadowColor: '#06B6D4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoContainer: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06B6D440',
    backgroundColor: '#27272A',
    ...Platform.select({
      ios: {
        shadowColor: '#06B6D4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  logo: {
    width: 48,
    height: 48,
  },
  welcomeTextContainer: {
    marginLeft: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#06B6D4',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06B6D430',
    alignItems: 'center',
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
  statsValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#06B6D4',
    marginVertical: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginBottom: 16,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAccessButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
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
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#06B6D420',
  },
  quickAccessText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
  },
  newsContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#06B6D430',
    backgroundColor: '#18181B95',
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
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#06B6D4',
    marginLeft: 12,
  },
  newsDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
    fontWeight: '500',
  },
});