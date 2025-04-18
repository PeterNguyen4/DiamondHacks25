import { SafeAreaView, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import ActionButton from '../../components/ActionButton';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile() {
    const [totals, setTotals] = useState(null);
    const [genaiResponse, setGenaiResponse] = useState(null);
    const scrollViewRef = React.useRef(null); // Add a ref for the ScrollView
    const macAddress = '192.168.1.177'; // from bryan home wifi
    const winAddress = '192.168.1.22'; // peter home wifi
    const LOCALHOST = macAddress
    const NUTRITION_LABELS = ["Calories","Fat","Carbohydrates","Proteins","Sugars","Calcium","Cholesterol","Fiber","Iron","Monounsaturated Fat","Polyunsaturated Fat","Salt","Saturated Fat","Sodium","Trans Fat","Vitamin A","Vitamin B1","Vitamin B2","Vitamin C","Vitamin PP"]

    useFocusEffect(
      React.useCallback(() => {
        fetch(`http://${LOCALHOST}:3001/api/totals`) 
          .then(response => response.json())
          .then(data => setTotals(data))
          .catch(error => console.error('Error fetching totals:', error));
      }, [])
    );

  const handleAdviceRequest = async () => {
    try {
        if (!totals) {
            console.log('Error', 'No nutrition facts available to send.');
            return;
        }

        // Send the nutrition facts to the /api/genai endpoint
        const response = await axios.get(`http://${LOCALHOST}:3001/genai`);

        // Handle the response from the server
        const genaiContent = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response content available.";
        setGenaiResponse(genaiContent);

        // Scroll to the top of the response area
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 500, animated: true });
        }, 100); // Add a slight delay to ensure the response is rendered
    } catch (error) {
        console.error('Error sending nutrition facts:', error.message);
        console.log('Error', 'Failed to get advice from the server.');
    }
  };

    return (
        <SafeAreaView style={styles.container}>
            {totals ? (
                <>
                  <Text style={styles.nutrition}> Total Nutrition Facts:</Text>
                  <ScrollView style={styles.scrollView} ref={scrollViewRef}>
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
    nutrition: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 10,
        alignSelf: 'flex-start', // Aligns the text to the left
        paddingLeft: 10,
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