import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,ScrollView,StyleSheet,} from "react-native";
import axiosInstance from "../../utils/axiosInstance"; // Reemplazamos axios por axiosInstance
import ConfirmationModal from "../status/ConfirmationModal";
import LoadingModal from "../status/LoadingModal";
import AlertModal from "../status/AlertModal";


const RegisterClient = () => {
  const [client, setClient] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefonos: [""],
    direccion: {
      calle: "",
      numero: "",
      colonia: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
    },
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleChange = (name, value) => {
    setClient({ ...client, [name]: value });
  };

  const handleDireccionChange = (name, value) => {
    setClient({
      ...client,
      direccion: { ...client.direccion, [name]: value },
    });
  };

  const handleTelefonoChange = (index, value) => {
    const nuevosTelefonos = [...client.telefonos];
    nuevosTelefonos[index] = value;
    setClient({ ...client, telefonos: nuevosTelefonos });
  };

  const agregarTelefono = () => {
    setClient({ ...client, telefonos: [...client.telefonos, ""] });
  };

  const handleConfirm = async () => {
    setModalVisible(false);
    setIsLoading(true);

    const clienteData = {
      nombre: client.nombre,
      apellidoPaterno: client.apellidoPaterno,
      apellidoMaterno: client.apellidoMaterno,
      correo: client.correo,
      telefono: client.telefonos.filter((t) => t !== ""),
      direccion: client.direccion,
    };

    try {
      await axiosInstance.post('api/cliente', clienteData); // Usamos axiosInstance aquí
      setTimeout(() => {
        setIsLoading(false);
        setAlertMessage("Cliente registrado correctamente");
        setAlertType("success");
        setAlertVisible(true);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setAlertMessage("No se pudo registrar el cliente");
      setAlertType("error");
      setAlertVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Cliente</Text>

        <TextInput
          placeholder="Nombre"
          value={client.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Apellido Paterno"
          value={client.apellidoPaterno}
          onChangeText={(text) => handleChange("apellidoPaterno", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Apellido Materno"
          value={client.apellidoMaterno}
          onChangeText={(text) => handleChange("apellidoMaterno", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Correo"
          value={client.correo}
          onChangeText={(text) => handleChange("correo", text)}
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Teléfonos</Text>
        {client.telefonos.map((telefono, index) => (
          <TextInput
            key={index}
            placeholder={`Teléfono ${index + 1}`}
            value={telefono}
            onChangeText={(text) => handleTelefonoChange(index, text)}
            style={styles.input}
            keyboardType="phone-pad"
          />
        ))}
        <TouchableOpacity onPress={agregarTelefono}>
          <Text style={styles.addPhone}>+ Agregar otro teléfono</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          placeholder="Calle"
          value={client.direccion.calle}
          onChangeText={(text) => handleDireccionChange("calle", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Número"
          value={client.direccion.numero}
          onChangeText={(text) => handleDireccionChange("numero", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Colonia"
          value={client.direccion.colonia}
          onChangeText={(text) => handleDireccionChange("colonia", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Ciudad"
          value={client.direccion.ciudad}
          onChangeText={(text) => handleDireccionChange("ciudad", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Estado"
          value={client.direccion.estado}
          onChangeText={(text) => handleDireccionChange("estado", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Código Postal"
          value={client.direccion.codigoPostal}
          onChangeText={(text) => handleDireccionChange("codigoPostal", text)}
          style={styles.input}
          keyboardType="default"
        />

        <TouchableOpacity style={styles.registerButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        isVisible={isModalVisible}
        message="¿Está seguro de que desea registrar este cliente?"
        onConfirm={handleConfirm}
        onCancel={() => setModalVisible(false)}
      />
      <AlertModal
        isVisible={alertVisible}
        type={alertType}
        message={alertMessage}
        redirectTo="Clients"
        onClose={() => setAlertVisible(false)}
      />
      <LoadingModal isLoading={isLoading} />
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
  addPhone: {
    color: "#6C2373",
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 10,
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
