import { TouchableOpacity, StyleSheet} from 'react-native';

export default function CancelButton({ icon, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {icon}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginLeft: 20, // Add space between the button and the left border
    },
});