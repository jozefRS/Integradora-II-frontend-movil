import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import SalesList from './SalesList';
import axiosInstance from '../../utils/axiosInstance';


const RegisterSale = () => {
  const [clients, setClients] = useState([]); // Lista real desde la base
  const [client, setClient] = useState('');   // ID del cliente seleccionado
  const [paymentType, setPaymentType] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [products, setProducts] = useState([]);  // Lista de productos agregados a la venta

  const [total, setTotal] = useState(0);



  // 📌 Calcular total cada vez que cambia la lista de productos
  useEffect(() => {
    const newTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    setTotal(newTotal);
  }, [products]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axiosInstance.get('/cliente');
        const clientList = res.data.body?.data || [];
        setClients(clientList);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      }
    };

    fetchClients();
  }, []);

  const handleRegisterSale = async () => {
    if (!client || products.length === 0 || !paymentType || !deliveryType) {
      alert('Por favor completa todos los campos y agrega al menos un producto.');
      return;
    }
  
    const productosMap = {};
    products.forEach((product) => {
      productosMap[product.id] = product.quantity;
    });
  
    const ventaData = {
      idCliente: client,
      productos: productosMap,
      subTotal: total,
      total: total,
      estado: true,
      aplicarIVA: false,
      tipoDePago: paymentType,
      tipoDeEntrega: deliveryType,
    };
  
    try {
      const response = await axiosInstance.post('/ventas/realizar', ventaData);
      console.log('✅ Venta registrada:', response.data);
      alert('Venta registrada exitosamente');
      // Limpieza del formulario opcional:
      setClient('');
      setProducts([]);
      setPaymentType('');
      setDeliveryType('');
    } catch (error) {
      console.error('❌ Error al registrar la venta:', error);
      alert('Ocurrió un error al registrar la venta.');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrar Venta</Text>

        {/* Cliente */}
        <Text style={styles.label}>Cliente</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={client}
            onValueChange={(itemValue) => setClient(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un cliente" value="" />
            {clients.map((cli) => (
              <Picker.Item
                key={cli.id}
                label={`${cli.nombre} ${cli.apellidoPaterno} ${cli.apellidoMaterno || ''}`.trim()}
                value={cli.id}
              />
            ))}
          </Picker>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>


        {/* Tipo de pago */}
        <Text style={styles.label}>Tipo de Pago</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={paymentType} onValueChange={(itemValue) => setPaymentType(itemValue)} style={styles.picker}>
            <Picker.Item label="Seleccione un tipo de pago" value="" />
            <Picker.Item label="Tarjeta" value="Tarjeta" />
            <Picker.Item label="Efectivo" value="Efectivo" />
          </Picker>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>

        {/* Tipo de Entrega */}
        <Text style={styles.label}>Tipo de Entrega</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={deliveryType} onValueChange={(itemValue) => setDeliveryType(itemValue)} style={styles.picker}>
            <Picker.Item label="Seleccione el tipo de entrega" value="" />
            <Picker.Item label="Físico" value="Físico" />
            <Picker.Item label="Domicilio" value="Domicilio" />
          </Picker>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>

        {/* 📌 Tabla de productos */}
        <SalesList products={products} setProducts={setProducts} />

        {/* 📌 Total de la venta */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total de pedido</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        {/* 📌 Botón de Registrar */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterSale}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#6C2373',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C2373',
    marginBottom: 5,
    marginLeft: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C2373',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#F8F3F8',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  pickerIcon: {
    position: 'absolute',
    right: 15,
  },
  // 📌 Estilos para el total
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 2,
    borderColor: '#6C2373',
  },
  totalText: {
    fontSize: 16,
    color: '#6C2373',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C2373',
    marginTop: 5,
  },
  // 📌 Estilos del botón de Registrar
  registerButton: {
    marginTop: 15,
    backgroundColor: '#6C2373',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterSale;
