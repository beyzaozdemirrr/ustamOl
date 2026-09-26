import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ListingProvider } from '../context/ListingContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ListingProvider>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#F5F8FC' }}>
          <StatusBar style="dark" backgroundColor="#F5F8FC" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F8FC' } }} />
        </SafeAreaView>
      </ListingProvider>
    </SafeAreaProvider>
  );
}
