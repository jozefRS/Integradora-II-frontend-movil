import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS , GLOBAL_STYLES} from '../styles/styles';

const ProductDetail = () => {
  const route = useRoute();
  const { product } = route.params;

  return (
    <View style={styles.container}>
      {/* Contenido en forma de card */}
      <View style={styles.card}>
        <Image source={product.image} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          <View style={GLOBAL_STYLES.line} />
          
          {/* Información adicional del producto */}
          <Text style={styles.productInfo}><Text style={styles.label}>Contenido:</Text> {product.content || 'No especificado'}</Text>
          <Text style={styles.productInfo}><Text style={styles.label}>Categoría:</Text> {product.category || 'No especificada'}</Text>
          <Text style={styles.productInfo}><Text style={styles.label}>Tipo de contenedor:</Text> {product.containerType || 'No especificado'}</Text>

          <View style={GLOBAL_STYLES.line} />
          
          <View style={styles.row}> 
            <Text style={styles.productPrice}>{product.price}</Text>
            <View style={[styles.badge, product.available ? styles.available : styles.unavailable]}>
              <Text style={styles.badgeText}>
                {product.available ? `${product.stock} unidades disponibles` : 'Agotado'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    width: '90%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  infoContainer: {
    width: '100%',
    paddingTop: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'justify',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 10,
  },
  productInfo: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginLeft: 10,
  },
  available: {
    backgroundColor: COLORS.secondary,
  },
  unavailable: {
    backgroundColor: COLORS.lightGray,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProductDetail;