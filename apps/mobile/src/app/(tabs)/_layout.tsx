import Feather from '@expo/vector-icons/Feather';
import { Redirect, Tabs } from 'expo-router';

import { useAccess } from '@/features/access/access-context';
import { Colors, Spacing } from '@/theme/tokens';

/**
 * The five approved tabs: Home, Method, Track, Dose, Profile.
 *
 * These labels are fixed. Do not rename them and do not add a sixth tab.
 * Welcome, Sign In, Create Account and the purchase flow deliberately live
 * outside this navigator, in the root stack.
 *
 * Access routing (Phase 2A brief §13):
 *   • signed out            -> redirected to the public Welcome screen
 *   • preview               -> browse-only shell
 *   • trialing              -> full shell
 *   • method_digital_active -> full shell
 *   • pyper_member_active   -> full shell
 *   • expired_read_only     -> read-only shell
 *
 * Write gating itself lives in the capability model, not here, so the tab
 * structure stays identical across states.
 */
export default function TabLayout() {
  const { isSignedIn } = useAccess();

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.espresso,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: true,
        // Web needs this explicitly; the default heuristic can put the label
        // beside the icon and clip it in a compact bar.
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopColor: Colors.border,
          height: 68,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarItemStyle: {
          // Keeps the label from being clipped under the icon on web, where
          // the bar has no safe-area inset to borrow from.
          paddingTop: Spacing.xs,
          paddingBottom: Spacing.sm,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="method"
        options={{
          title: 'Method',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Method',
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Track',
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dose"
        options={{
          title: 'Dose',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Dose',
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
