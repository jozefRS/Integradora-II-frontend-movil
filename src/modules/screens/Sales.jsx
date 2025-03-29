import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, GLOBAL_STYLES } from '../../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const URL_BASE = 'http://192.168.1.67:8080/api';

const Sales = () => {
  const navigation = useNavigation();
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const [salesRes, clientsRes, productsRes] = await Promise.all([
        axios.get(`${URL_BASE}/ventas`),
        axios.get(`${URL_BASE}/cliente`),
        axios.get(`${URL_BASE}/producto`)
      ]);

      const sales = salesRes.data.body?.data || [];
      const clients = clientsRes.data.body?.data || [];
      const products = productsRes.data.body?.data || [];

      const enrichedSales = sales.map(sale => {
        const client = clients.find(c => c.id === sale.idCliente);
        const clientName = client
          ? `${client.nombre} ${client.apellidoPaterno} ${client.apellidoMaterno || ''}`.trim()
          : 'Cliente desconocido';

        const saleProducts = Object.entries(sale.productos).map(([productId, quantity]) => {
          console.log('🧩 Buscando producto con ID:', productId);
          const product = products.find(p => p.id === productId);

          if (!product) {
            console.warn(`❌ Producto con ID ${productId} no encontrado en la lista de productos`);
            return {
              id: productId,
              name: 'Producto no disponible',
              price: '$0.00',
              quantity,
              total: '$0.00'
            };
          }

          const unitPrice = parseFloat(product.precio);
          return {
            id: productId,
            name: product.nombre,
            price: `$${unitPrice.toFixed(2)}`,
            quantity,
            total: `$${(unitPrice * quantity).toFixed(2)}`
          };
        });

        return {
          ...sale,
          clientName,
          products: saleProducts
        };
      });

      setSalesData(enrichedSales);
    } catch (error) {
      console.error("Error al cargar ventas, clientes o productos", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Ventas</Text>
      <View style={GLOBAL_STYLES.line} />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('RegisterSale')}
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
            <Text style={styles.cell}>{item.clientName}</Text>
            <Text style={styles.cell}>{item.tipoDePago}</Text>
            <Text style={styles.cell}>{item.tipoDeEntrega}</Text>
            <Text style={styles.cell}>${item.total.toFixed(2)}</Text>
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