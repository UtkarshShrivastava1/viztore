import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="products/[slug]"
          options={{
            headerShown: true,
            title: 'Product Details',
            headerBackTitle: 'Back',
            headerTintColor: '#081028',
          }}
        />
        <Stack.Screen
          name="checkout/index"
          options={{
            headerShown: true,
            title: 'Checkout',
            headerBackTitle: 'Cart',
            headerTintColor: '#081028',
          }}
        />
        <Stack.Screen
          name="checkout/success"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
