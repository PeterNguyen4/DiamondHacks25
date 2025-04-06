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
        left: 0,
        top: 0,
        position: 'absolute',
        marginTop: 20,
        marginLeft: 20,
    }
});