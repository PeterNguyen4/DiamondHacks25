import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native'
import { useState, useEffect } from 'react'

export default function Profile() {
  const [totals, setTotals] = useState(null);
  const macAddress = '192.168.1.177'; // from bryan home wifi
  const winAddress = '192.168.1.22'; // peter home wifi

  useEffect(() => {
    fetch(`http://${winAddress}:3001/api/totals`) // Replace with your actual endpoint
      .then(response => response.json())
      .then(data => setTotals(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

    return (
        <View style={styles.container}>
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
                <Button title="Get Advice" />
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