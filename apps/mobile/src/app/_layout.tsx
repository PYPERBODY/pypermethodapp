import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AccessProvider } from '@/features/access/access-context';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Colors } from '@/theme/tokens';

/**
 * Root navigator.
 *
 * Public entry routes (Welcome, plan selection, purchase confirmation, Sign In,
 * Create Account) live here, OUTSIDE the authenticated `(tabs)` shell. The tab
 * navigator is a single screen within this stack.
 */
export default function RootLayout() {
  const reducedMotion = useReducedMotion();

  return (
    <SafeAreaProvider>
      <AccessProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: reducedMotion ? 'none' : 'default',
            contentStyle: { backgroundColor: Colors.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="plan" />
          <Stack.Screen
            name="purchase"
            // Native modal presentation: the simulated store sheet sits above
            // the flow rather than replacing it.
            options={{
              presentation: 'modal',
              animation: reducedMotion ? 'none' : 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="create-account" />
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        </Stack>
      </AccessProvider>
    </SafeAreaProvider>
  );
}
