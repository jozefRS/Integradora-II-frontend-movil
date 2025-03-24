import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import axios from "axios";

const API_URL = "http://192.168.1.67:8080/api/cliente"; // Reemplaza con la IP de tu backend

const RegisterClient = () => {
  const [client, setClient] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    telefonoAdicional: "",
    direccion: {
      calle: "",
      numero: "",
      colonia: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
    },
  });

  const handleChange = (name, value) => {
    setClient({ ...client, [name]: value });
  };

  const handleDireccionChange = (name, value) => {
    setClient({
      ...client,
      direccion: { ...client.direccion, [name]: value },
    });
  };

  const handleSubmit = async () => {
    const clienteData = {
      nombre: client.nombre,
      apellidoPaterno: client.apellidoPaterno,
      apellidoMaterno: client.apellidoMaterno,
      correo: client.correo,
      telefono: [client.telefono, client.telefonoAdicional].filter(Boolean),
      direccion: client.direccion,
    };

    try {
      const response = await axios.post(API_URL, clienteData);
      Alert.alert("Éxito", "Cliente registrado correctamente");
      console.log("Cliente registrado:", response.data);
    } catch (error) {
      console.error("Error al registrar cliente:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo registrar el cliente");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Cliente</Text>

        {/* Nombre y Apellidos */}
        <TextInput placeholder="Nombre" value={client.nombre} onChangeText={(text) => handleChange("nombre", text)} style={styles.input} />
        <TextInput placeholder="Apellido Paterno" value={client.apellidoPaterno} onChangeText={(text) => handleChange("apellidoPaterno", text)} style={styles.input} />
        <TextInput placeholder="Apellido Materno" value={client.apellidoMaterno} onChangeText={(text) => handleChange("apellidoMaterno", text)} style={styles.input} />

        {/* Correo */}
        <TextInput placeholder="Correo" value={client.correo} onChangeText={(text) => handleChange("correo", text)} style={styles.input} keyboardType="email-address" />

        {/* Teléfonos */}
        <TextInput placeholder="Teléfono" value={client.telefono} onChangeText={(text) => handleChange("telefono", text)} style={styles.input} keyboardType="phone-pad" />
        <TextInput placeholder="Teléfono Adicional" value={client.telefonoAdicional} onChangeText={(text) => handleChange("telefonoAdicional", text)} style={styles.input} keyboardType="phone-pad" />

        {/* Dirección */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput placeholder="Calle" value={client.direccion.calle} onChangeText={(text) => handleDireccionChange("calle", text)} style={styles.input} />
        <TextInput placeholder="Número" value={client.direccion.numero} onChangeText={(text) => handleDireccionChange("numero", text)} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Colonia" value={client.direccion.colonia} onChangeText={(text) => handleDireccionChange("colonia", text)} style={styles.input} />
        <TextInput placeholder="Ciudad" value={client.direccion.ciudad} onChangeText={(text) => handleDireccionChange("ciudad", text)} style={styles.input} />
        <TextInput placeholder="Estado" value={client.direccion.estado} onChangeText={(text) => handleDireccionChange("estado", text)} style={styles.input} />
        <TextInput placeholder="Código Postal" value={client.direccion.codigoPostal} onChangeText={(text) => handleDireccionChange("codigoPostal", text)} style={styles.input} keyboardType="numeric" />

        {/* Botón de registro */}
        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// 📌 Estilos del formulario
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#6C2373",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6C2373",
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "#6C2373",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#F8F3F8",
  },
  registerButton: {
    marginTop: 15,
    backgroundColor: "#6C2373",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RegisterClient;
