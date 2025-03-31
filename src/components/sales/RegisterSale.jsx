import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GLOBAL_STYLES, COLORS } from '../../styles/styles';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import SalesList from './SalesList';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigation } from '@react-navigation/native';
import ConfirmationModal from '../status/ConfirmationModal';
import LoadingModal from '../status/LoadingModal';
import AlertModal from '../status/AlertModal';
import { Switch } from 'react-native';


const RegisterSale = () => {
  const navigation = useNavigation();

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [applyIVA, setApplyIVA] = useState(false);
  const [iva, setIva] = useState(0);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const subTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const calculatedIVA = applyIVA ? subTotal * 0.16 : 0;
    setIva(calculatedIVA);
    setTotal(subTotal + calculatedIVA);
  }, [products, applyIVA]);



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

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    const productosMap = {};
    products.forEach((product) => {
      productosMap[product.id] = product.quantity;
    });

    const subTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const iva = applyIVA ? subTotal * 0.16 : 0;
    const totalFinal = subTotal + iva;

    const ventaData = {
      idCliente: client,
      productos: productosMap,
      subTotal: subTotal,
      total: totalFinal,
      estado: true,
      aplicarIVA: applyIVA,
      tipoDePago: paymentType,
      tipoDeEntrega: deliveryType,
    };


    try {
      await axiosInstance.post('/ventas/realizar', ventaData);

      setClient('');
      setProducts([]);
      setPaymentType('');
      setDeliveryType('');

      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage('Venta registrada exitosamente.');
        setAlertType('success');
        setAlertVisible(true);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setAlertMessage('Ocurrió un error al registrar la venta.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrar Venta</Text>

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

        <Text style={styles.label}>Tipo de Pago</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={paymentType} onValueChange={(itemValue) => setPaymentType(itemValue)} style={styles.picker}>
            <Picker.Item label="Seleccione un tipo de pago" value="" />
            <Picker.Item label="Tarjeta" value="Tarjeta" />
            <Picker.Item label="Efectivo" value="Efectivo" />
            <Picker.Item label="Transferencia" value="Transferencia" />
            <Picker.Item label="Crédito" value="Crédito" />
          </Picker>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>

        <Text style={styles.label}>Tipo de Entrega</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={deliveryType} onValueChange={(itemValue) => setDeliveryType(itemValue)} style={styles.picker}>
            <Picker.Item label="Seleccione el tipo de entrega" value="" />
            <Picker.Item label="Físico" value="Físico" />
            <Picker.Item label="Domicilio" value="Domicilio" />
            <Picker.Item label="Recoger en tienda" value="Recoger en tienda" />
            <Picker.Item label="Envío" value="Envío" />
          </Picker>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>¿Aplicar IVA?</Text>
          <Switch
            value={applyIVA}
            onValueChange={setApplyIVA}
            thumbColor={applyIVA ? COLORS.primary : "#ccc"}
            trackColor={{ false: "#ccc", true: COLORS.lightGray }}
          />
        </View>
        <Text style={{ textAlign: 'right', marginRight: 10, color: '#555' }}>
          IVA aplicado: ${iva.toFixed(2)}
        </Text>


        <SalesList products={products} setProducts={setProducts} />

        <View style={styles.totalContainer}>
          <View style={styles.rowRight}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${(total - iva).toFixed(2)}</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.totalLabel}>IVA (16%):</Text>
            <Text style={styles.totalValue}>${iva.toFixed(2)}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        </View>


        <TouchableOpacity style={styles.registerButton} onPress={() => setShowConfirmation(true)}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        isVisible={showConfirmation}
        message="¿Estás seguro de que deseas registrar esta venta?"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
      />

      <AlertModal
        isVisible={alertVisible}
        type={alertType}
        message={alertMessage}
        redirectTo="Sales"
        onClose={() => setAlertVisible(false)}
      />

      <LoadingModal isLoading={isLoading} message="Registrando venta..." />
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
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 15,
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switch: {
    marginLeft: 10,
  },
  rowRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: '#444',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  
});

export default RegisterSale;
