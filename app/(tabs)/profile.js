
import { SafeAreaView, StyleSheet, Text, View,ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ActionButton from '../../components/ActionButton';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile() {
    const [totals, setTotals] = useState(null);
    const [genaiResponse, setGenaiResponse] = useState(null);
    const macAddress = '192.168.1.177'; // from bryan home wifi
    const winAddress = '192.168.1.22'; // peter home wifi
    const NUTRITION_LABELS = ["Calories","Fat","Carbohydrates","Proteins","Sugars","Calcium","Cholesterol","Fiber","Iron","Monounsaturated Fat","Polyunsaturated Fat","Salt","Saturated Fat","Sodium","Trans Fat","Vitamin A","Vitamin B1","Vitamin B2","Vitamin C","Vitamin PP"]

  useEffect(() => {
    fetch(`http://${winAddress}:3001/api/totals`) // Replace with your actual endpoint
      .then(response => response.json())
      .then(data => setTotals(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  const handleAdviceRequest = async () => {
    try {
        if (!totals) {
            console.log('Error', 'No nutrition facts available to send.');
            return;
        }

        // Send the nutrition facts to the /api/genai endpoint
        const response = await axios.post(`http://${winAddress}:3001/api/genai`, {
            nutritionFacts: totals, // Send the totals as nutritionFacts
        });

        // Handle the response from the server
        const genaiContent = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response content available.";
        setGenaiResponse(genaiContent);
        // console.log('GenAI Response:', genaiContent);
    } catch (error) {
        console.error('Error sending nutrition facts:', error.message);
        console.log('Error', 'Failed to get advice from the server.');
    }
  };

    return (
        <SafeAreaView style={styles.container}>
            {totals ? (
                <>
                  <ScrollView style={styles.scrollView}>
                    <View style={styles.table}>
                      {NUTRITION_LABELS.map((key) => (
                          <View key={key} style={styles.row}>
                              <Text style={styles.cell}>{key}</Text>
                              <Text style={[styles.cell, { textAlign: 'right' }]}>
                                  {(totals[key] ? parseFloat(totals[key]).toFixed(2) : 0)}
                              </Text>
                          </View>
                      ))}
                    </View>
                    <View style={styles.container}>
                      {genaiResponse ? (
                        <>
                          <Text style={styles.subheading}>GenAI Nutrition Advice</Text>
                          <Text style={styles.advice}>{genaiResponse}</Text>  
                        </>
                      )
                          : null}
                    </View>
                  </ScrollView>
                  <ActionButton icon={<FontAwesome6 name="question" size={20} color="white" />} text='Get Advice' onPress={handleAdviceRequest} />
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        width: '100%'
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
    subheading: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 20,
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
    advice: {
      textAlign: 'left',
      fontSize: 16,
      paddingBottom: 32,
      lineHeight: 24,
    }
});