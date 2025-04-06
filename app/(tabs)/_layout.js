import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Platform } from 'react-native';

export default function Layout() {
    return <Tabs screenOptions={{ 
        headerStyle: {
            backgroundColor: '#f8f8f8',
            shadowColor: 'transparent',
            borderBottomWidth: 0,
            height: 120
        },
        headerTitleContainerStyle: {
            // paddingTop: 10, // Add padding to the top
            paddingBottom: 10, // Add padding to the bottom
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
            fontSize: 32,
            fontWeight: 'bold',
        },
        tabBarStyle: { 
            backgroundColor: '#fff', 
            borderTopWidth: 0, 
            ...Platform.select({
                ios: {
                    shadowColor: '#C6C6C6',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 3,
                },
                android: {
                    elevation: 5, // For Android
                },
                }),
        },
    }}>
        <Tabs.Screen name="home" options={{ 
            title: 'Home', 
            tabBarActiveTintColor: '#448176',
            tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="house" color={color} /> }} 
        />
        <Tabs.Screen name="add" options={{ 
            title: 'Scan',
            tabBarActiveTintColor: '#448176',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="barcode-scan" size={28} color={color} /> }} 
        />
        <Tabs.Screen name="profile" options={{ 
            title: 'Profile',
            tabBarActiveTintColor: '#448176',
            tabBarIcon: ({ color }) => <Octicons size={28} name="person-fill" color={color} /> }} 
        />
    </Tabs>;
}