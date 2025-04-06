import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

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

  const renderProducts = ({ item }) => (
    <View style={styles.productBox}>
      <Text style={styles.productName}>{item.product_name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24, marginTop: 8 }}>
          <FontAwesome6 name="fire" size={16} color="#FF4500" />
          <Text style={styles.productServing}>Cal: {item.nutriments['energy-kcal_value']}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 24, marginTop: 8 }}>
          <FontAwesome6 name="bowl-food" size={16} color="#8B4513" />
          <Text style={styles.productServing}>Portions: {item.servings}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24, marginTop: 8 }}>
          <FontAwesome6 name="weight-hanging" size={16} color="#5E5E5E" />
          <Text style={styles.productServing}>Serving Size: {item.serving_quantity} {item.serving_quantity_unit}</Text>
        </View>
      </View>
    </View>
  );

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
    alignItems: 'center',
    paddingTop: 40,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  productBox: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
});