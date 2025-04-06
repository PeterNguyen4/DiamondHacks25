import { useData } from './context/DataContext';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native'; // Added Alert and ScrollView import
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useState, useEffect } from 'react'; // Added useState and useEffect
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown

export default function Scanned() {
    const { sharedData } = useData();
    const router = useRouter();
    const [product, setProduct] = useState(null); // State to store API result
    const [servings, setServings] = useState(1); // State for selected servings
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
                <>
                    <Text style={styles.title}>{product.product.product_name}</Text>
                    <Text style={styles.text}>
                        Nutrition Facts: {product.product.serving_quantity} {product.product.serving_quantity_unit} per serving
                    </Text>

                    {/* Buttons to increase or decrease servings */}
                    <View style={styles.servingsContainer}>
                        <Button
                            title="-"
                            onPress={() => setServings((prev) => Math.max(1, prev - 1))} // Decrease servings, minimum 1
                        />
                        <Text style={styles.servingsText}>{servings} servings</Text>
                        <Button
                            title="+"
                            onPress={() => setServings((prev) => prev + 1)} // Increase servings
                        />
                    </View>

                    <ScrollView style={styles.scrollView}>
                        <View style={styles.table}>
                            {[
                                "energy-kcal",
                                "fat",
                                "carbohydrates",
                                "proteins",
                                "sugars",
                                "calcium",
                                "cholesterol",
                                "fiber",
                                "iron",
                                "monounsaturated-fat",
                                "polyunsaturated-fat",
                                "salt",
                                "saturated-fat",
                                "sodium",
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
                                        {((product.product.nutriments[key] || 0) * servings).toFixed(2)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </>
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
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        width: '100%',
        marginTop: 20,
    },
    content: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 5,
    },
    title: {
        fontSize: 24,
        marginTop: 100,
        textAlign: 'center',
    },
    table: {
        width: '100%',
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
        flex: 1,
        textAlign: 'left',
    },
    picker: {
        height: 50,
        width: '100%',
        marginVertical: 10,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom:30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    servingsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    servingsText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
});