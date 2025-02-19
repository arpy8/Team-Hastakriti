import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'] | React.ComponentProps<typeof Entypo>['name'];
  color: string;
}) {
  const { name, color } = props;
  const isFontAwesome = Object.keys(FontAwesome.glyphMap).includes(name as string);

  return isFontAwesome ? (
    <FontAwesome name={name as React.ComponentProps<typeof FontAwesome>['name']} size={28} color={color} style={{ marginBottom: -3 }} />
  ) : (
    <Entypo name={name as React.ComponentProps<typeof Entypo>['name']} size={24} color={color} style={{ marginBottom: -2 }} />
  );
}

const HeaderTitle = ({ subtitle }: { subtitle: string }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#09090b',
  }}>
    <View style={{ backgroundColor: '#09090b' }}>
      <Text style={{
        color: '#e2e2e5',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
        letterSpacing: 1,
        textShadowColor: 'rgba(74, 222, 128, 0.35)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      }}>
        Hastakriti
      </Text>
      <Text style={{
        color: '#a1a1aa',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      }}>
        {subtitle}
      </Text>
    </View>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#09090B' },
      tabBarActiveTintColor: '#06B6D4',
      tabBarInactiveTintColor: '#71717A',
      headerStyle: { backgroundColor: '#09090B' },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => <HeaderTitle subtitle="Dashboard" />,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gestures"
        options={{
          title: 'Gestures',
          headerTitle: () => <HeaderTitle subtitle="Gesture Control" />,
          tabBarIcon: ({ color }) => <MaterialIcons name="gesture" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manual"
        options={{
          title: "Manual Control",
          headerTitle: () => <HeaderTitle subtitle="Manual Control" />,
          tabBarIcon: ({ color }) => <TabBarIcon name="hand" color={color} />,
        }}
      />
      <Tabs.Screen
        name="emg"
        options={{
          title: "EMG Signal",
          headerTitle: () => <HeaderTitle subtitle="Live EMG Signals" />,
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: () => <HeaderTitle subtitle="Settings" />,
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}