import React, { useState, useEffect, useCallback } from 'react';
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
import { useContext } from 'react';
import { CatalogContext } from '../../context/CatalogContext';
import { AuthContext } from '../../context/AuthContext';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  client: yup.string().required('Seleccione un cliente'),
  paymentType: yup.string().required('Seleccione tipo de pago'),
  deliveryType: yup.string().required('Seleccione tipo de entrega'),
  products: yup.array().min(1, 'Agregue al menos un producto')
});

const RegisterSale = () => {
  const navigation = useNavigation();
  const { updateStock } = useContext(CatalogContext);
  const { user } = useContext(AuthContext); // <-- ✅ obtenemos el id del trabajador

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [applyIVA, setApplyIVA] = useState(false);
  const [iva, setIva] = useState(0);

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [submitted, setSubmitted] = useState(false);

  const validateField = useCallback(async (field, value) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [field]: error.message }));
    }
  }, []);

  // Validar campos en tiempo real después del primer intento
  useEffect(() => {
    if (submitted) validateField('client', client);
  }, [client, submitted, validateField]);

  useEffect(() => {
    if (submitted) validateField('paymentType', paymentType);
  }, [paymentType, submitted, validateField]);

  useEffect(() => {
    if (submitted) validateField('deliveryType', deliveryType);
  }, [deliveryType, submitted, validateField]);

  useEffect(() => {
    if (submitted) validateField('products', products);
  }, [products, submitted, validateField]);


  useEffect(() => {
    const subTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const calculatedIVA = applyIVA ? subTotal * 0.16 : 0;
    setIva(calculatedIVA);
    setTotal(subTotal + calculatedIVA);
  }, [products, applyIVA]);



  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axiosInstance.get('api/cliente');
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

    // 1. Construimos el 'productosMap' para enviar al backend
    const productosMap = {};
    products.forEach((product) => {
      productosMap[product.id] = product.quantity;
    });

    // 2. Calculamos subtotal, IVA, total
    const subTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const iva = applyIVA ? subTotal * 0.16 : 0;
    const totalFinal = subTotal + iva;

    console.log("🧪 Trabajador actual desde contexto:", user);

    // 3. Armamos el objeto para la venta
    const ventaData = {
      idCliente: client,
      productos: productosMap,
      subTotal,
      total: totalFinal,
      estado: true,
      aplicarIVA: applyIVA,
      tipoDePago: paymentType,
      tipoDeEntrega: deliveryType,
      idTrabajador: user?.idUsuario,
    };

    try {
      // 4. Enviamos la venta al backend
      await axiosInstance.post('api/ventas/realizar', ventaData);

      // 5. (Opcional) Actualizar stock localmente en el contexto
      //    Creamos un array "updates" con { productId, quantitySold }
      //    para cada producto vendido.
      const updates = products.map((prod) => ({
        productId: prod.id,
        quantitySold: prod.quantity,
      }));

      // Llamamos la función que descuenta del stock
      updateStock(updates);

      // 6. Limpiamos estados
      setClient('');
      setProducts([]);
      setPaymentType('');
      setDeliveryType('');

      // 7. Mostramos feedback al usuario
      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage('Venta registrada exitosamente.');
        setAlertType('success');
        setAlertVisible(true);
      }, 1000);

    } catch (error) {
      // Manejo de error
      setIsLoading(false);
      setAlertMessage('Ocurrió un error al registrar la venta.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  // 🛑 Modificar el onPress del botón de registro
  const handleRegisterPress = async () => {
    setSubmitted(true);
    try {
      await validationSchema.validate({
        client,
        paymentType,
        deliveryType,
        products
      }, { abortEarly: false });

      setErrors({});
      setShowConfirmation(true);
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
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
            onValueChange={setClient}
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
        {errors.client && <Text style={styles.errorText}>{errors.client}</Text>}

        <Text style={styles.label}>Tipo de Pago</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={paymentType}
            onValueChange={setPaymentType}
            style={styles.picker}>
            <Picker.Item label="Seleccione un tipo de pago" value="" />
            <Picker.Item label="Tarjeta" value="Tarjeta" />
            <Picker.Item label="Efectivo" value="Efectivo" />
            <Picker.Item label="Transferencia" value="Transferencia" />
          </Picker>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>
        {errors.paymentType && <Text style={styles.errorText}>{errors.paymentType}</Text>}

        <Text style={styles.label}>Tipo de Entrega</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={deliveryType}
            onValueChange={setDeliveryType}
            style={styles.picker}>
            <Picker.Item label="Seleccione el tipo de entrega" value="" />
            <Picker.Item label="Físico" value="Físico" />
            <Picker.Item label="Domicilio" value="Domicilio" />
            <Picker.Item label="Recoger en tienda" value="Recoger en tienda" />
            <Picker.Item label="Envío" value="Envío" />
          </Picker>
          <Icon name="chevron-down-outline" size={20} color="#6C2373" style={styles.pickerIcon} />
        </View>
        {errors.deliveryType && <Text style={styles.errorText}>{errors.deliveryType}</Text>}

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
        {errors.products && <Text style={styles.errorText}>{errors.products}</Text>}

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


        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 15
  },

});

export default RegisterSale;