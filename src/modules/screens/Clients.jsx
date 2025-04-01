import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../utils/axiosInstance"; // Reemplazamos axios por axiosInstance
import { GLOBAL_STYLES,COLORS } from "../../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";
import StatusBar from "../../components/status/StatusBar"; // 📌 Importamos el componente de carga
import AlertModal from '../../components/status/AlertModal';

const API_URL = "http://192.168.106.115:8080/api/cliente"; // ⚠️ Reemplaza con tu IP local

const Client = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 📌 Estado de carga
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  const fetchClients = async () => {
    try {
      setIsLoading(true); // 📌 Activa el estado de carga
      const response = await axiosInstance.get(API_URL); // Usamos axiosInstance aquí
      const clientes = response.data.body?.data || [];
      setClients(clientes);
    } catch (error) {
      setAlertMessage('Error al cargar clientes');
      setAlertType('error');
      setAlertVisible(true);
    } finally {
      setIsLoading(false); // 📌 Desactiva el estado de carga cuando termine
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <View style={styles.container}>
      {/* 📌 Animación de carga mientras se obtienen los datos */}
      <StatusBar isLoading={isLoading} />

      <Text style={styles.title}>Gestión de Clientes</Text>
      <View style={GLOBAL_STYLES.line} />

      {/* Botón para registrar nuevo cliente */}
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("RegisterClient")}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>

      {/* 📌 Encabezados de la tabla */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Nombre</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>Contacto</Text>
        <Text style={styles.headerText}>Acciones</Text>
      </View>

      {/* 📌 Mostrar clientes solo cuando la carga haya terminado */}
      {!isLoading && (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.nombre} {item.apellidoPaterno}</Text>
              <Text style={styles.cell}>{item.correo}</Text>
              <Text style={styles.cell}>{item.telefono[0]}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate("EditClient", { client: item })}>
                  <Icon name="pencil-outline" size={20} color={COLORS.black} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ClientDetail", { client: item })}>
                  <Icon name="eye-outline" size={20} color={COLORS.black} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Icon name="trash-outline" size={20} color={COLORS.darkGray} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <AlertModal
        isVisible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

// 📌 Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
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
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.black,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
});

export default Client;
