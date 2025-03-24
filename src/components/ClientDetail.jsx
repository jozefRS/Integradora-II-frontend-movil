import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../styles/styles";

export default function ClientDetail() {
  const route = useRoute();
  const { client } = route.params; // 📌 Obtener datos del cliente desde la navegación

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* 📌 Nombre del Cliente */}
        <Text style={styles.clientName}>
          {client.nombre} {client.apellidoPaterno} {client.apellidoMaterno}
        </Text>
        <Text style={styles.description}>Detalles de contacto y dirección del cliente</Text>

        {/* 📌 Línea divisoria */}
        <View style={styles.divider} />

        {/* 📌 Información detallada */}
        <Text style={styles.info}>
          <Text style={styles.label}>Correo: </Text> {client.correo}
        </Text>

        {/* 📌 Teléfonos */}
        <Text style={styles.info}>
          <Text style={styles.label}>Teléfono principal: </Text> {client.telefono[0] || "No disponible"}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Teléfono adicional: </Text> {client.telefono[1] || "No disponible"}
        </Text>

        {/* 📌 Línea divisoria */}
        <View style={styles.divider} />

        {/* 📌 Dirección desglosada */}
        <Text style={styles.sectionTitle}>Dirección</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Calle: </Text> {client.direccion.calle.trim()}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Número: </Text> {client.direccion.numero.trim()}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Colonia: </Text> {client.direccion.colonia.trim()}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Ciudad: </Text> {client.direccion.ciudad.trim()}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Estado: </Text> {client.direccion.estado.trim()}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Código Postal: </Text> {client.direccion.codigoPostal.trim()}
        </Text>

        {/* 📌 Línea divisoria */}
        <View style={styles.divider} />

        {/* 📌 Bloque final para posibles botones o más información */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Cliente activo</Text>
        </View>
      </View>
    </View>
  );
}

// 📌 Estilos mejorados con más espacio y alineación correcta
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25, // Más espacio interno
    width: "95%", // Mayor ancho
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "flex-start",
  },
  clientName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "left",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: COLORS.black,
    marginVertical: 5,
    textAlign: "left",
    lineHeight: 22,
  },
  label: {
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: COLORS.primary,
    textAlign: "left",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primary,
    width: "100%",
    marginVertical: 10,
  },
  footer: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 15,
  },
  footerText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});