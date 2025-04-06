import { useData } from './context/DataContext';
import { View, Text, StyleSheet, Button, Alert } from 'react-native'; // Added Alert import
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useState, useEffect } from 'react'; // Added useState and useEffect

export default function Scanned() {
    const { sharedData } = useData();
    const router = useRouter();
    const [product, setProduct] = useState(null); // State to store API result
    const macAddress = '192.168.1.177'; // from bryan home wifi

    useEffect(() => {
        const sendData = async (data) => {
            try {
                const response = await axios.get(`http://${macAddress}:3001/api/${data}`);
                const jsonVer = response.data; 
                console.log("Success", jsonVer);
                console.log('name', jsonVer.product.product_name); // Access JSON properties directly
                setProduct(jsonVer); // Update state with API result
            } catch (error) {
                console.error("Error sending data:", error);
                Alert.alert("Error", "Failed to send data to server");
            }
        };

        sendData(sharedData); // Trigger API call when component mounts
    }, [sharedData]); 

    return (
        <View style={styles.container}>
            {product ? (
                <View>
                    <Text style={styles.text}>{product.product.product_name}</Text>
                    <Text style={styles.text}>Nutrition Facts:</Text>
                    <View style={styles.table}>
                        {[
                            "calcium",
                            "carbohydrates",
                            "cholesterol",
                            "energy-kcal",
                            "fat",
                            "fiber",
                            "iron",
                            "monounsaturated-fat",
                            "polyunsaturated-fat",
                            "proteins",
                            "salt",
                            "saturated-fat",
                            "sodium",
                            "sugars",
                            "trans-fat",
                            "vitamin-a",
                            "vitamin-b1",
                            "vitamin-b2",
                            "vitamin-c",
                            "vitamin-pp",
                        ].map((key) => (
                            <View key={key} style={styles.row}>
                                <Text style={styles.cell}>{key.replace(/-/g, " ")}:</Text>
                                <Text style={styles.cell}>
                                    {product.product.nutriments[key] || ""}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <Text style={styles.text}>Loading...</Text>
            )}
            <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={() => router.push('/home')} />
                <Button title="Confirm" onPress={() => router.push('/home')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
    table: {
        marginTop: 20,
        width: '90%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        fontSize: 16,
        color: '#333',
    },
});