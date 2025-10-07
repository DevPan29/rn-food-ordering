import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';


export const TopTabs = withLayoutContext(
  createMaterialTopTabNavigator().Navigator
);

export default function OrdersTabs() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <TopTabs screenOptions={{
          tabBarActiveTintColor: '#000',     // colore del testo del tab attivo
          tabBarInactiveTintColor: '#999',      // colore del testo dei tab inattivi
        }}>
        <TopTabs.Screen name="index" options={{ title: 'Active' }} />
      </TopTabs>
    </SafeAreaView>
  );
}