import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function Home() {
  const [products, setProducts] = useState(null);
  const macAddress = '192.168.1.177'; // from bryan home wifi
  const winAddress = '192.168.1.22'; // peter home wifi


  useEffect(() => {
    fetch(`http://${winAddress}:3001/api/summary`) // Replace with your actual endpoint
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  const deleteProduct = (id) => {
    fetch(`http://${winAddress}:3001/api/${id}`, {
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24, marginTop: 16 }}>
                <FontAwesome6 name="fire" size={16} color="#FF4500" />
                <Text style={styles.productServing}>Cal: {item.nutriments['energy-kcal_value']}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 24, marginTop: 16 }}>
                <FontAwesome6 name="bowl-food" size={16} color="#8B4513" />
                <Text style={styles.productServing}>Portions: {item.servings}</Text>
            </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 128, marginTop: 12 }}>
                <FontAwesome6 name="weight-hanging" size={16} color="#5E5E5E" />
                <Text style={styles.productServing}>Serving Size: {item.serving_quantity} {item.serving_quantity_unit}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteProduct(item._id)}
            >
                <Icon name="trash" size={18} color='#d3d3d3'/> 
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProducts}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    paddingTop: 40,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  productBox: {
    backgroundColor: '#fff',
    padding: 20,
    paddingRight: 48, // Add extra right padding to avoid overlap with the delete button
    marginVertical: 8,
    borderRadius: 24,
    // width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative', // Enable absolute positioning for child elements
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productServing: {
    fontSize: 12,
    color: '#5E5E5E',
    marginLeft: 8,
  },    
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    paddingBottom:20
  },
  deleteButton: {
    // position: 'absolute',
    top: '50%', // Center vertically relative to the productBox
    left: '20%', // Position it to the right of the productBox
    transform: [{ translateY: -10 }], // Adjust for proper vertical alignment
    // padding: 8, // Adjusted padding for the icon
    // borderRadius: 20, // Circular button
    // alignItems: 'center',
    // justifyContent: 'center',
  }
});