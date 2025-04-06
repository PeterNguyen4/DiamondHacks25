import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function Home() {
  const [products, setProducts] = useState(null);
  const macAddress = '192.168.1.177'; // from bryan home wifi

  useEffect(() => {
    fetch(`http://${macAddress}:3001/api/summary`) // Replace with your actual endpoint
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  const deleteProduct = (id) => {
    fetch(`http://${macAddress}:3001/api/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.filter(product => product._id !== id));
        } else {
          console.error('Failed to delete product');
        }
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const renderProducts = ({ item }) => (
    <View style={styles.productBox}>
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productServing}>Portions: {item.servings}</Text>
      <Text style={styles.productServing}>Serving Size: {item.serving_quantity} {item.serving_quantity_unit}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteProduct(item._id)}
      >
        <Icon name="trash" size={20} color='#d3d3d3'/> 
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Daily</Text>
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
    paddingRight: 48, // Add extra right padding to avoid overlap with the delete button
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative', // Enable absolute positioning for child elements
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    paddingBottom:20
  },
  deleteButton: {
    position: 'absolute',
    top: '50%', // Center vertically relative to the productBox
    right: 16,
    transform: [{ translateY: -10 }], // Adjust for proper vertical alignment
    padding: 8, // Adjusted padding for the icon
    borderRadius: 20, // Circular button
    alignItems: 'center',
    justifyContent: 'center',
  },
});