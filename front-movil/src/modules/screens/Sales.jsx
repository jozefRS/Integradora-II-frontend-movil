import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, GLOBAL_STYLES } from '../../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const salesData = [
  { 
    id: '1', client: 'Karol Ramirez', paymentType: 'Tarjeta', deliveryType: 'Físico', total: '$2300',
    products: [
      { id: '101', name: 'Producto 1', price: '$500', quantity: 2, total: '$1000' },
      { id: '102', name: 'Producto 2', price: '$78', quantity: 5, total: '$390' },
    ]
  },
  { 
    id: '2', client: 'Uziel Degante', paymentType: 'Efectivo', deliveryType: 'Domicilio', total: '$2800',
    products: [
      { id: '103', name: 'Producto 3', price: '$56', quantity: 3, total: '$168' },
      { id: '104', name: 'Producto 4', price: '$100', quantity: 4, total: '$400' },
    ]
  }
];

const Sales = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Ventas</Text>
      <View style={GLOBAL_STYLES.line} />

      {/* Botón para ir a Registrar Venta */}
      <TouchableOpacity 
  style={styles.registerButton} 
  onPress={() => navigation.navigate('RegisterSale')} // Ahora está correctamente definido en el Stack
>
  <Text style={styles.registerButtonText}>Registrar Venta</Text>
</TouchableOpacity>


      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Cliente</Text>
        <Text style={styles.headerText}>Tipo de pago</Text>
        <Text style={styles.headerText}>Tipo de entrega</Text>
        <Text style={styles.headerText}>Total</Text>
        <Text style={styles.headerText}>Acciones</Text>
      </View>

      <FlatList
        data={salesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.client}</Text>
            <Text style={styles.cell}>{item.paymentType}</Text>
            <Text style={styles.cell}>{item.deliveryType}</Text>
            <Text style={styles.cell}>{item.total}</Text>
            <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => navigation.navigate('SalesDetail', { sale: item })}
            >
              <Icon name="eye-outline" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: COLORS.primary,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.black,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Sales;
