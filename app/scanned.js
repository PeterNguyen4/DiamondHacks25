import { useData } from './context/DataContext';
import { View, Text, StyleSheet, Button, Alert, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native'; // Added Alert and ScrollView import
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useState, useEffect } from 'react'; // Added useState and useEffect
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown
import ActionButton from '../components/ActionButton';
import CancelButton from '../components/CancelButton'; // Import IconButton for back button
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Scanned() {
    const { sharedData } = useData();
    const router = useRouter();
    const [product, setProduct] = useState(null); // State to store API result
    const [servings, setServings] = useState(1); // State for selected servings
    const macAddress = '192.168.1.177'; // from bryan home wifi
    const winAddress = '192.168.1.22'; // peter home wifi
    const NUTRITION_LABELS = ["Calories","Fat","Carbohydrates","Proteins","Sugars","Calcium","Cholesterol","Fiber","Iron","Monounsaturated Fat","Polyunsaturated Fat","Salt","Saturated Fat","Sodium","Trans Fat","Vitamin A","Vitamin B1","Vitamin B2","Vitamin C","Vitamin PP"]
    const RAW_API_LABELS = ["energy-kcal","fat","carbohydrates","proteins","sugars","calcium","cholesterol","fiber","iron","monounsaturated-fat","polyunsaturated-fat","salt","saturated-fat","sodium","trans-fat","vitamin-a","vitamin-b1","vitamin-b2","vitamin-c","vitamin-pp"]

    useEffect(() => {
        const sendData = async (data) => {
            try {
                const response = await axios.get(`http://${winAddress}:3001/api/${data}`);
                const jsonVer = response.data; 
                setProduct(jsonVer); // Update state with API result
            } catch (error) {
                console.error("Error sending data:", error);
                Alert.alert("Error", "Failed to send data to server");
            }
        };

        sendData(sharedData); // Trigger API call when component mounts
    }, [sharedData]); 

    const handleConfirm = async () => {
        try {
            const dataToSave = {
                product_name: product.product.product_name,
                servings: servings,
                serving_quantity: product.product.serving_quantity,
                serving_quantity_unit:product.product.serving_quantity_unit,
                nutriments: Object.keys(product.product.nutriments).reduce((acc, key) => {
                    acc[key] = (product.product.nutriments[key] || 0) * servings;
                    return acc;
                }, {}),
            };

            await axios.post(`http://${winAddress}:3001/api/product`, dataToSave);
            router.push('/home');
        } catch (error) {
            console.error("Error saving data:", error);
            Alert.alert("Error", "Failed to save data to the server");
        }
    };

    const handleCancel = async () => {
        router.push('/home')
    }

    return (
        <SafeAreaView style={styles.container}>
            {product ? (
                <>
                    <View style={{ position: 'relative', width: '100%', alignItems: 'center' }}>
                        <CancelButton icon={<FontAwesome6 name="arrow-left" size={24} color="black" />} onPress={handleCancel}/>
                        <Text style={styles.title}>{product.product.product_name}</Text>
                    </View>
                    
                    <View><Text style={styles.text}>
                        Nutrition Facts: {product.product.serving_quantity} {product.product.serving_quantity_unit} per serving
                    </Text></View>
                    

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
                            {NUTRITION_LABELS.map((key, index) => (
                                <View key={key} style={styles.row}>
                                    <Text style={styles.cell}>{key}</Text>
                                    <Text style={[styles.cell, { textAlign: 'right' }]}>
                                        {((product.product.nutriments[RAW_API_LABELS[index]] || 0) * servings).toFixed(2)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView> 
                    <ActionButton icon={<FontAwesome6 name="plus" size={20} color="white" />} text='Add' onPress={handleConfirm} />
                </>
            ) : (
                <ActivityIndicator color="black" style={{ justifyContent: 'center', position: 'absolute' }}/>
            )}
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        fontSize:32
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 32,
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