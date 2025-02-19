import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useWebSocket } from '@/context/WebSocketContext';
import { Slider } from '@miblanchard/react-native-slider';

const MAX_DATA_POINTS = 100; // Increased for smoother visualization
const UPDATE_INTERVAL = 16; // ~60fps for smooth animation

export default function EMGScreen() {
  const { isConnected, sendMessage, connect, disconnect } = useWebSocket();
  const [emgData, setEmgData] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [metrics, setMetrics] = useState({
    peakValue: 0,
    signalStrength: 'Low',
    lastBurst: 'No burst detected'
  });

  // Updated EMG signal simulation
  useEffect(() => {
    const baseValue = 20;
    const burstProbability = 0.01; // Reduced for smoother transitions
    let lastBurstTime = 'No burst detected';
    let currentValue = baseValue;
    
    const interval = setInterval(() => {
      if (isConnected) {
        setEmgData(currentData => {
          // Smooth transition to next value
          const noise = Math.random() * 10;
          const target = Math.random() < burstProbability 
            ? baseValue + Math.random() * 60 + 20
            : baseValue + noise;
          
          // Interpolate between current and target value
          currentValue += (target - currentValue) * 0.1;
          
          if (currentValue > baseValue + 30) {
            setIsActive(true);
            lastBurstTime = new Date().toLocaleTimeString();
            setTimeout(() => setIsActive(false), 500);
          }

          const newData = [...currentData, currentValue];
          if (newData.length > MAX_DATA_POINTS) {
            newData.shift();
          }

          // Update metrics
          const peak = Math.max(...newData);
          const signalStrength = peak > 70 ? 'High' : peak > 40 ? 'Medium' : 'Low';
          
          setMetrics({
            peakValue: Math.round(peak),
            signalStrength,
            lastBurst: lastBurstTime
          });

          return newData;
        });
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleThresholdChange = (value: number[]) => {
    setThreshold(value[0]);
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#121215',
    backgroundGradientTo: '#121215',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
    strokeWidth: 1.5, // Thinner line for smoother appearance
    paddingRight: 0,
    paddingLeft: 0,
  };

  const graphWidth = Dimensions.get('window').width - 64; // Adjust for container padding

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>EMG Signal</Text>
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

      <View style={styles.graphContainer}>
        <LineChart
          data={{
            labels: [],
            datasets: [{ data: emgData.length > 0 ? emgData : [0] }],
          }}
          width={graphWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.graph}
          withDots={false}
          withInnerLines={false}
          withOuterLines={true}
          withHorizontalLabels={true}
          withVerticalLabels={false}
          segments={4}
          withShadow={false} // Remove shadow for better performance
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, isActive && styles.statCardActive]}>
          <Text style={styles.statLabel}>Current Value</Text>
          <Text style={styles.statValue}>
            {emgData.length > 0 ? Math.round(emgData[emgData.length - 1]) : 0}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>
            {emgData.length > 0
              ? Math.round(emgData.reduce((a, b) => a + b, 0) / emgData.length)
              : 0}
          </Text>
        </View>
      </View>

      <View style={styles.thresholdContainer}>
        <View style={styles.thresholdHeader}>
          <Text style={styles.thresholdTitle}>Signal Threshold</Text>
          <Text style={styles.thresholdValue}>{Math.round(threshold)}</Text>
        </View>
        <Slider
          value={threshold}
          onValueChange={handleThresholdChange}
          minimumValue={0}
          maximumValue={100}
          step={1}
          containerStyle={styles.slider}
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
          minimumTrackTintColor="#06B6D4"
          maximumTrackTintColor="#27272A"
        />
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <MaterialIcons name="speed" size={24} color="#06B6D4" />
          <Text style={styles.metricLabel}>Peak Value</Text>
          <Text style={styles.metricValue}>{metrics.peakValue}</Text>
        </View>
        <View style={styles.metricBox}>
          <MaterialIcons name="whatshot" size={24} color="#06B6D4" />
          <Text style={styles.metricLabel}>Signal Strength</Text>
          <Text style={styles.metricValue}>{metrics.signalStrength}</Text>
        </View>
        <View style={styles.metricBox}>
          <MaterialIcons name="timer" size={24} color="#06B6D4" />
          <Text style={styles.metricLabel}>Last Burst</Text>
          <Text style={styles.metricValue}>{metrics.lastBurst}</Text>
        </View>
      </View>
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
  graphContainer: {
    backgroundColor: '#18181B95',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#06B6D430',
    overflow: 'hidden', // Add this to prevent leaking
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181B95',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#06B6D430',
  },
  statLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    color: '#06B6D4',
    fontWeight: '600',
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
  statCardActive: {
    borderColor: '#06B6D4',
    borderWidth: 2,
  },
  graph: {
    marginHorizontal: -16, // Compensate for container padding
    marginVertical: 0,
    borderRadius: 0,
    position: 'relative',
    top: 16,
    right: 4,
  },
  thresholdContainer: {
    backgroundColor: '#18181B95',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#06B6D430',
  },
  thresholdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  thresholdTitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  thresholdValue: {
    fontSize: 16,
    color: '#06B6D4',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#18181B95',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#06B6D430',
  },
  metricLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '600',
    marginTop: 2,
  },
});