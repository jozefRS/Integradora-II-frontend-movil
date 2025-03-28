import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { GLOBAL_STYLES } from '../../styles/styles';
import Product from '../../components/Product';

const products = [
  { 
    id: '1', 
    name: 'Product 1', 
    price: '$19.99', 
    image: { uri: 'https://placehold.co/400.png' },
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
    available: true, 
    stock: 10,
    content: '500 ml',
    category: 'Cuidado de la piel',
    containerType: 'Botella'
  },
  { 
    id: '2', 
    name: 'Product 2', 
    price: '$24.99', 
    image: { uri: 'https://placehold.co/200.png' }, 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
    available: true, 
    stock: 5,
    content: '200 ml',
    category: 'Shampoo',
    containerType: 'Tubo'
  },
  { 
    id: '3', 
    name: 'Product 3', 
    price: '$29.99', 
    image: { uri: 'https://placehold.co/200.png' }, 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
    available: false,
    stock: 0,
    content: '100 ml',
    category: 'Aceites esenciales',
    containerType: 'Frasco'
  },
  { 
    id: '4', 
    name: 'Product 4', 
    price: '$14.99', 
    image: { uri: 'https://placehold.co/200.png' }, 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
    available: false,
    stock: 0,
    content: '50 ml',
    category: 'Cremas',
    containerType: 'Tarro'
  },
  { 
    id: '5', 
    name: 'Product 5', 
    price: '$34.99', 
    image: { uri: 'https://placehold.co/200.png' }, 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
    available: true, 
    stock: 8,
    content: '30 ml',
    category: 'Suplementos',
    containerType: 'Ampolleta'
  }
];


const CatalogScreen = () => {
  return (
    <View style={GLOBAL_STYLES.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Product product={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  },
});

export default CatalogScreen;
