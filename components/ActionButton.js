import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';

export default function ActionButton({ icon, text, onPress }) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#448176',
        padding: 16,
        paddingHorizontal: 24,
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginBottom: 20,
        marginRight: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 1000,
        ...Platform.select({
            ios: {
              shadowColor: '#3C6860',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.6,
              shadowRadius: 3,
            },
            android: {
              elevation: 5, // For Android
            },
          }),
    },
    icon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});