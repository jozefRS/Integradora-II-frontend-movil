import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, GLOBAL_STYLES } from '../../styles/styles';

const SaleDetail = () => {
  const route = useRoute();
  const { sale } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Venta</Text>
      <View style={GLOBAL_STYLES.line} />

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>{sale.client}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tipo de Pago:</Text>
        <Text style={styles.value}>{sale.tipoDePago}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tipo de Entrega:</Text>
        <Text style={styles.value}>{sale.tipoDeEntrega}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>${parseFloat(sale.total).toFixed(2)}</Text>
      </View>

      <View style={GLOBAL_STYLES.line} />
      <Text style={styles.subTitle}>Productos en esta venta</Text>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Producto</Text>
        <Text style={styles.headerText}>Precio Unidad</Text>
        <Text style={styles.headerText}>Cantidad</Text>
        <Text style={styles.headerText}>Total</Text>
      </View>
      <FlatList
        data={sale.products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.total}</Text>
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
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: COLORS.black,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: COLORS.primary,
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
    color: COLORS.secondary,
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
    color: COLORS.darkGray,
  },
});

export default SaleDetail;
