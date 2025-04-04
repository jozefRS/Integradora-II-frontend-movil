import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { COLORS } from '../../styles/styles';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ConfirmationModal from '../../components/status/ConfirmationModal';
import LoadingModal from '../../components/status/LoadingModal';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setConfirmVisible(false); // Oculta el modal
    setIsLoading(true); // Muestra loading
    await logout(); // Ejecuta logout
    setIsLoading(false); // Oculta loading (aunque por navegación quizás no lo veas mucho)
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={user?.photoURL ? { uri: user.photoURL } : { uri: 'https://avatar.iran.liara.run/public/boy' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Icon name="person" size={22} color={COLORS.primary} />
          <Text style={styles.infoText}>Rol: {user?.role || 'Vendedor'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Icon name="phone" size={22} color={COLORS.primary} />
          <Text style={styles.infoText}>{user?.phone || '+52 000 000 0000'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Icon name="date-range" size={22} color={COLORS.primary} />
          <Text style={styles.infoText}>Miembro desde: {user?.joinDate || '2024'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setConfirmVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="exit-to-app" size={24} color={COLORS.white} />
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isVisible={confirmVisible}
        message="¿Estás seguro de que quieres cerrar sesión?"
        onConfirm={handleLogout}
        onCancel={() => setConfirmVisible(false)}
      />

      {/* Modal de Carga */}
      <LoadingModal isLoading={isLoading} message="Cerrando sesión..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.dark,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default UserProfile;
