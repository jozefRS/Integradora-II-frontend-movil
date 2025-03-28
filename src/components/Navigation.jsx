import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CatalogScreen from '../modules/screens/Catalog';
import ProductDetailScreen from '../components/catalog/ProductDetail';
import HomeScreen from '../modules/auth/LoginScreen';
import SalesTableScreen from '../modules/screens/Sales';
import SalesDetailScreen from '../components/SaleDetail';
//import EditClientScreen from '../screens/EditClient';
import { COLORS } from '../styles/styles';
import Client from '../modules/screens/Clients';
import ClientDetail from '../components/ClientDetail';
import RegisterClient from '../components/RegisterClient';
import RegisterSale from './RegisterSale';
import EditClient from './EditClient';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 📌 Pila de navegación para el catálogo y detalles del producto
const CatalogStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.black,
      headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catálogo' }} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detalles del Producto' }} />
  </Stack.Navigator>
);

// 📌 Pila de navegación para la gestión de ventas
const SalesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.black,
      headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Sales" component={SalesTableScreen} options={{ title: 'Gestión de Ventas' }} />
    <Stack.Screen name="SalesDetail" component={SalesDetailScreen} options={{ title: 'Detalles de la Venta' }} />
    <Stack.Screen name="RegisterSale" component={RegisterSale} options={{ title: 'Registrar Venta' }} /> 
  </Stack.Navigator>
);

// 📌 Pila de navegación para la gestión de clientes
const ClientsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.black,
      headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Clients" component={Client} options={{ title: 'Gestión de Clientes' }} />
    <Stack.Screen name="ClientDetail" component={ClientDetail} options={{ title: 'Detalles del Cliente' }} />
    <Stack.Screen name="RegisterClient" component={RegisterClient} options={{ title: 'Registrar Cliente' }} />
    <Stack.Screen name="EditClient" component={EditClient} options={{ title: 'Editar Cliente' }} />
  </Stack.Navigator>
);

const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home-outline';
            else if (route.name === 'Catalog') iconName = 'list-outline';
            else if (route.name === 'Sales') iconName = 'cash-outline';
            else if (route.name === 'Clients') iconName = 'people-outline';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.darkGray,
          tabBarStyle: { backgroundColor: COLORS.white, paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Catalog" component={CatalogStack} options={{ headerShown: false }} />
        <Tab.Screen name="Sales" component={SalesStack} options={{ headerShown: false, title: 'Ventas' }} />
        <Tab.Screen name="Clients" component={ClientsStack} options={{ headerShown: false, title: 'Clientes' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;