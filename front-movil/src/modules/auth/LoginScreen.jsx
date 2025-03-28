import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { GLOBAL_STYLES, COLORS, FONTS } from '../../styles/styles';

const LoginScreen = () => {
  return (
    <ImageBackground 
      source={require('../../../assets/favicon.png')} 
      style={GLOBAL_STYLES.background}
    >
      <View style={GLOBAL_STYLES.overlay}>
        <Text style={[FONTS.title, { textAlign: 'center' }]}>Iniciar Sesión</Text>
        <View style={GLOBAL_STYLES.line} />

        <TextInput
          placeholder="Nombre de usuario"
          style={GLOBAL_STYLES.input}
        />

        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={GLOBAL_STYLES.input}
        />

        <View style={GLOBAL_STYLES.line} />

        <TouchableOpacity style={GLOBAL_STYLES.button}>
          <Text style={GLOBAL_STYLES.buttonText}>Iniciar</Text>
        </TouchableOpacity>

        <Text style={GLOBAL_STYLES.forgotText}>¿Olvidaste tu contraseña? </Text>
        <TouchableOpacity>
          <Text style={GLOBAL_STYLES.recoverText}>Recuperar</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
