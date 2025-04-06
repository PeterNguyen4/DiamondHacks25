import { Stack } from 'expo-router';
import { DataProvider } from './context/DataContext';

export default function Layout() {
  return (
    <DataProvider>
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="scanned" options={{ headerShown: false }} /> 
      </Stack>
    </DataProvider>
  )
}