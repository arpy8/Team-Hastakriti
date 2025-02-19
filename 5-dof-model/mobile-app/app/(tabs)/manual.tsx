import { Slider } from '@miblanchard/react-native-slider';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useWebSocket } from '@/context/WebSocketContext';


export default function MotorsPage() {
  const [motorValues, setMotorValues] = useState({
    motor1: 0,
    motor2: 0,
    motor3: 0,
    motor4: 0,
    motor5: 0
  });
  const { isConnected, sendMessage, connect, disconnect } = useWebSocket();


  useEffect(() => {
    console.log('WebSocket connection status:', isConnected);
  }, [isConnected]);

  const handleMotorChange = (motor: string, value: number) => {
    setMotorValues(prev => ({
      ...prev,
      [motor]: value
    }));
  };

  const handleSlideComplete = (motor: string, value: number) => {
    const motorNumber = motor.slice(-1);
    const message = `S${motorNumber}${Math.round(value)}`;
    console.log('Sending value after slide complete:', message);

    if (!isConnected) {
      console.warn('WebSocket not connected!');
      return;
    }

    if (motor || value) {
      sendMessage(message);
    }
  };

  const handleReset = () => {
    setMotorValues({
      motor1: 0,
      motor2: 0,
      motor3: 0,
      motor4: 0,
      motor5: 0
    });

    sendMessage('R');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Motor Control</Text>
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

      <View style={styles.cardContainer}>
        {Object.entries(motorValues).map(([motor, value]) => (
          <View key={motor} style={styles.sliderCard}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{motor.toUpperCase().replace(/(.{5})(.)/, '$1 $2')}</Text>
              <Text style={styles.value}>{Math.round(value)}°</Text>
            </View>
            <Slider
              value={value}
              onValueChange={(values) => handleMotorChange(motor, values[0])}
              onSlidingComplete={(values) => handleSlideComplete(motor, values[0])}
              minimumValue={0}
              maximumValue={180}
              step={1}
              containerStyle={styles.slider}
              thumbStyle={styles.thumb}
              trackStyle={styles.track}
              minimumTrackTintColor="#06B6D4"
              maximumTrackTintColor="#27272A"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.resetButton]}
        onPress={handleReset}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="refresh" size={24} color="#06B6D4" />
        </View>
        <Text style={styles.resetButtonText}>Reset All Motors</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#09090B',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#E2E8F0',
    letterSpacing: 0.5,
  },
  cardContainer: {
    gap: 16,
  },
  sliderCard: {
    backgroundColor: '#18181B95',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 20,
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
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: 'grey',
  },
  value: {
    fontSize: 16,
    color: '#06B6D4',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: '#06B6D4',
    borderRadius: 12,
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#06B6D430',
    ...Platform.select({
      ios: {
        shadowColor: '#06B6D4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27272A',
  },
  resetButton: {
    backgroundColor: '#18181B95',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
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
  resetButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    marginBottom: 18,
    backgroundColor: '#09090B',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
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