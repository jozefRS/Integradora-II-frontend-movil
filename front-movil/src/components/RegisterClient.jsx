import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { GLOBAL_STYLES, COLORS, FONTS } from '../styles/styles';

const RegisterClient = () => {
  const [form, setForm] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    telefonoAdicional: '',
    fechaAfiliacion: '',
    calle: '',
    numeroDomicilio: '',
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = () => {
    console.log("Cliente Registrado:", form);
  };

  return (
    <ImageBackground source={require('../../assets/favicon.png')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro de Cliente</Text>

          <View style={GLOBAL_STYLES.line} />

          <TextInput
            placeholder="Nombre Completo"
            placeholderTextColor="#333"
            value={form.nombreCompleto}
            onChangeText={(text) => handleChange('nombreCompleto', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#333"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Teléfono"
            placeholderTextColor="#333"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(text) => handleChange('telefono', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Teléfono adicional"
            placeholderTextColor="#333"
            keyboardType="phone-pad"
            value={form.telefonoAdicional}
            onChangeText={(text) => handleChange('telefonoAdicional', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Fecha de afiliación"
            placeholderTextColor="#333"
            value={form.fechaAfiliacion}
            onChangeText={(text) => handleChange('fechaAfiliacion', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Calle"
            placeholderTextColor="#333"
            value={form.calle}
            onChangeText={(text) => handleChange('calle', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Número de domicilio"
            placeholderTextColor="#333"
            keyboardType="numeric"
            value={form.numeroDomicilio}
            onChangeText={(text) => handleChange('numeroDomicilio', text)}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparencia en el fondo
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6C2373',
    marginBottom: 10,
  },
  divider: {
    height: 2,
    backgroundColor: '#6C2373',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#6C2373',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterClient;
