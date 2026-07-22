import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AccessProvider } from '@/features/access/access-context';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Colors } from '@/theme/tokens';
import { FONT_ASSETS } from '@/theme/typography';

// Hold the splash screen until the approved brand typography is ready, so the
// app never renders a frame in a system fallback face.
SplashScreen.preventAutoHideAsync();

/**
 * Root navigator.
 *
 * Public entry routes (Welcome, plan selection, purchase confirmation, Sign In,
 * Create Account) live here, OUTSIDE the authenticated `(tabs)` shell. The tab
 * navigator is a single screen within this stack.
 */
export default function RootLayout() {
  const reducedMotion = useReducedMotion();
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  useEffect(() => {
    // Hide on error too, otherwise a missing font asset would leave the app
    // stuck behind the splash screen instead of degrading visibly.
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

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
