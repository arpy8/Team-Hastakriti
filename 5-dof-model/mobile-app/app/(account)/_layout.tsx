import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#fff',
        },
        contentStyle: {
          backgroundColor: '#121212',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Account',
        }}
      />
      <Stack.Screen
        name="personal-information"
        options={{
          title: 'Personal Information',
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: 'Security',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="help-support"
        options={{
          title: 'Help & Support',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About',
        }}
      />
    </Stack>
  );
}