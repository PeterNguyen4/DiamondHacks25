import React from 'react'; 
import { SafeAreaView, StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile() {
  const [totals, setTotals] = useState(null);
  const macAddress = '192.168.1.177'; // from bryan home wifi
  const winAddress = '192.168.1.22'; // peter home wifi

  useFocusEffect(
    React.useCallback(() => {
      fetch(`http://${macAddress}:3001/api/totals`) 
        .then(response => response.json())
        .then(data => setTotals(data))
        .catch(error => console.error('Error fetching totals:', error));
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      {totals ? (
        <>
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
                    {(totals[key] ? parseFloat(totals[key]).toFixed(2) : 0)}
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
        <Button title="Get Advice" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
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
    marginBottom: 30,
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