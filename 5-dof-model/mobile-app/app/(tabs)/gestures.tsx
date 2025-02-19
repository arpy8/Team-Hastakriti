import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useWebSocket } from '@/context/WebSocketContext';

type CommandType = 'P' | 'C' | 'K' | 'I' | 'O' | 'R' | 'W';

const defaultGestures = [
  { id: 1, name: 'Victory', icon: 'emoji-events', description: 'Peace sign', command: 'V' as CommandType },
  { id: 2, name: 'Thumbs Up', icon: 'thumb-up', description: 'Thumbs Up bruh', command: 'T' as CommandType },
  { id: 3, name: 'Okay', icon: 'self-improvement', description: 'Okay', command: 'O' as CommandType },
  { id: 4, name: 'Point', icon: 'touch-app', description: 'Index point', command: 'I' as CommandType },
  { id: 5, name: 'Closed Fist', icon: 'sports-mma', description: 'Closed fist', command: 'C' as CommandType },
  { id: 6, name: 'Rest', icon: 'do-not-touch', description: 'Neutral position', command: 'R' as CommandType },
  { id: 7, name: 'Wave', icon: 'waves', description: 'Wave Gestures', command: 'W' as CommandType },
  { id: 8, name: 'Custom', icon: 'gesture', description: 'Custom Gesture 2', command: 'R' as CommandType }
];

export default function GesturesScreen() {
  const { isConnected, sendMessage, connect, disconnect } = useWebSocket();

  useEffect(() => {
    console.log('WebSocket connection status:', isConnected);
  }, [isConnected]);

  const handleGesturePress = (gestureId: number) => {
    const gesture = defaultGestures.find(g => g.id === gestureId);
    
    if (!isConnected) {
      console.warn('WebSocket not connected!');
      return;
    }
    
    if (gesture) {
      try {
        console.log('Sending gesture command:', gesture.command);
        sendMessage(gesture.command);
      } catch (error) {
        console.error('Error sending gesture:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Gestures</Text>
          <TouchableOpacity
            style={[
              styles.connectButton,
              isConnected ? styles.connectButtonDanger : styles.connectButtonPrimary,
            ]}
            onPress={isConnected ? disconnect : connect}
          >
            <MaterialIcons 
              name={isConnected ? "link-off" : "link"} 
              size={16} 
              color="#FFFFFF" 
              style={styles.connectButtonIcon}
            />
            <Text style={styles.connectButtonText}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, { color: isConnected ? '#10B981' : '#EF4444' }]}>
          Status: {isConnected ? 'Connected to device' : 'Not connected'}
        </Text>
      </View>

      <View style={styles.tilesContainer}>
        {defaultGestures.map((gesture, index) => (
          <Animated.View
            key={gesture.id}
            entering={FadeInUp.delay(100 * index).springify()}
            style={styles.tileWrapper}
          >
            <TouchableOpacity
              style={styles.tile}
              onPress={() => handleGesturePress(gesture.id)}
            >
              <MaterialIcons 
                name={gesture.icon as any} 
                size={32} 
                color="#06B6D4"
              />
              <Text style={styles.gestureName}>
                {gesture.name}
              </Text>
              <Text style={styles.gestureDescription}>
                {gesture.description}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    padding: 16,
  },
  header: {
    marginBottom: 18,
    backgroundColor: '#09090B',
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
  tilesContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 0,
    justifyContent: 'space-between',
  },
  tileWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  tile: {
    backgroundColor: '#18181B95',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#06B6D430',
    alignItems: 'center',
    height: 140,
    justifyContent: 'center',
  },
  gestureName: {
    fontSize: 16,
    color: '#E2E8F0',
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  gestureDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    right: 16,
    top: 8,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  connectButtonPrimary: {
    backgroundColor: '#18181B',
    borderColor: '#27272A',
  },
  connectButtonDanger: {
    backgroundColor: '#7F1D1D',
    borderColor: '#991B1B',
  },
  connectButtonIcon: {
    marginRight: 6,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});