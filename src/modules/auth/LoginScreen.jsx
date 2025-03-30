import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance'; // Importamos el axiosInstance
import { GLOBAL_STYLES, COLORS, FONTS } from '../../styles/styles';

const API_URL = 'http://192.168.1.67:8080/auth/login';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}?email=${email}&contrasena=${contrasena}`);
      const token = response.data;
      
      // Guardamos el token en AsyncStorage y actualizamos el estado de autenticación
      login(token);
    } catch (error) {
      Alert.alert('Error de inicio de sesión', 'Credenciales inválidas');
    }
  };

  return (
    <ImageBackground 
      source={require('../../../assets/imagenlogin.png')} 
      style={GLOBAL_STYLES.background}
    >
      <View style={GLOBAL_STYLES.overlay}>
        <Image source={require('../../../assets/image.png')} style={{width:130, height:130, alignSelf:'center'}} />
        <Text style={[FONTS.title, { textAlign: 'center' }]}>Iniciar Sesión</Text>
        <View style={GLOBAL_STYLES.line} />

        <TextInput
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          style={GLOBAL_STYLES.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
          style={GLOBAL_STYLES.input}
        />

        <View style={GLOBAL_STYLES.line} />

        <TouchableOpacity style={GLOBAL_STYLES.button} onPress={handleLogin}>
          <Text style={GLOBAL_STYLES.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
