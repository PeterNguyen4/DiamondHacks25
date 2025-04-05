import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Layout() {
    return <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="home" options={{ 
            title: 'Home', 
            tabBarIcon: ({ color }) => <MaterialIcons size={24} name="home" color={color} /> }} 
        />
        <Tabs.Screen name="add" options={{ 
            title: 'Add',
            tabBarIcon: ({ color }) => <MaterialIcons size={24} name="add-circle" color={color} /> }} 
        />
        <Tabs.Screen name="profile" options={{ 
            title: 'Profile',
            tabBarIcon: ({ color }) => <MaterialIcons size={24} name="person" color={color} /> }} 
        />
    </Tabs>;
}