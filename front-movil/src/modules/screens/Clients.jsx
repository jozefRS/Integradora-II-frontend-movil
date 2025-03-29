import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const clientsData = [
  { id: '1', name: 'Karol Jozef', email: 'karoljozef@gmail.com', contact: '+52 55 1234 5678', date: '23/08/2023' },
  { id: '2', name: 'Uziel Jahred', email: 'uzieljahred@gmail.com', contact: '+52 33 9876 5432', date: '17/11/2023' },
  { id: '3', name: 'Derick Axel', email: 'derickaxel@gmail.com', contact: '+52 81 2345 6789', date: '06/01/2025' }
];

const Client = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Clientes</Text>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegisterClient')}>
        <Text style={styles.registerText}>Registrar</Text>
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Nombre</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>Contacto</Text>
        <Text style={styles.headerText}>Fecha de alineación</Text>
        <Text style={styles.headerText}>Acciones</Text>
      </View>
      <FlatList
        data={clientsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.email}</Text>
            <Text style={styles.cell}>{item.contact}</Text>
            <Text style={styles.cell}>{item.date}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('EditClient', { client: item })}>
                <Icon name="pencil-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ClientDetail', { client: item })}>
                <Icon name="eye-outline" size={20} color={COLORS.black} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="trash-outline" size={20} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: COLORS.primary,
  },
  registerButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerText: {
    color: COLORS.white,
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
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.black,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  }
});

export default Client;
