import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { GLOBAL_STYLES, FONTS } from '../../styles/styles';
import AlertModal from '../../components/status/AlertModal';
import LoadingModal from '../../components/status/LoadingModal';

const API_URL = 'http://192.168.106.115:8080/auth/login';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${API_URL}?email=${email}&contrasena=${contrasena}`);
      const token = response.data;
      login(token);
    } catch (error) {
      setAlertMessage('Credenciales inválidas. Verifica tu correo y contraseña.');
      setAlertType('error');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/imagenlogin.png')}
      style={GLOBAL_STYLES.background}
    >
      <View style={GLOBAL_STYLES.overlay}>
        <Image source={require('../../../assets/image.png')} style={{ width: 130, height: 130, alignSelf: 'center' }} />
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

      {/* Alert y loading modals */}
      <AlertModal
        isVisible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <LoadingModal isLoading={isLoading} message="Iniciando sesión..." />
    </ImageBackground>
  );
};

export default LoginScreen;
