import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native'
import { useState, useEffect } from 'react'

export default function Home() {
  const [products, setProducts] = useState(null);
  const macAddress = '192.168.1.177'; // from bryan home wifi

  useEffect(() => {
    fetch(`http://${macAddress}:3001/api/product-list`) // Replace with your actual endpoint
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  const renderProducts = ({ item }) => (
    <View style={styles.productBox}>
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productServing}>Portions: {item.servings}</Text>
      <Text style={styles.productServing}>Serving Size: {item.serving_quantity} {item.serving_quantity_unit}</Text>
    </View>
  );

  console.log(products)
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProducts}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  productBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productServing: {
    fontSize: 14,
    color: '#555',
  },
});