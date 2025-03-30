import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { GLOBAL_STYLES } from '../../styles/styles';
import Product from '../../components/catalog/Product';
import LoadingModal from '../../components/status/LoadingModal';
import AlertModal from '../../components/status/AlertModal';
import CatalogSearchBar from '../../components/catalog/CatalogSearchbar';
import axiosInstance from '../../utils/axiosInstance'; // Importamos axiosInstance
import StatusBar from "../../components/status/StatusBar"; // 📌 Importamos el componente de carga

const CatalogScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, products]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, subcatRes] = await Promise.all([
        axiosInstance.get('/producto'), // Usamos axiosInstance
        axiosInstance.get('/categoria'), // Usamos axiosInstance
        axiosInstance.get('/subcategoria'), // Usamos axiosInstance
      ]);

      const categorias = catRes.data.body?.data || [];
      const subcategorias = subcatRes.data.body?.data || [];
      const productosFiltrados = prodRes.data.body.data.filter((p) => p.estado);

      const productosTransformados = productosFiltrados.map((p) => {
        const categoria = categorias.find(cat => cat.id === (p.idCategoria?.[0] || ''));
        const subcategoria = subcategorias.find(sub => sub.id === (p.idSubcategoria?.[0] || ''));

        return {
          id: p.id,
          name: p.nombre,
          price: `$${p.precio}`,
          image: p.imagen ? { uri: p.imagen } : { uri: 'https://placehold.co/200.png' },
          description: p.descripcion || 'Sin descripción',
          available: p.stock > 0,
          stock: p.stock,
          content: p.cantidad ? `${p.cantidad} ${p.unidadMedida}` : 'N/A',
          category: categoria ? categoria.nombre : 'Sin categoría',
          containerType: subcategoria ? subcategoria.nombre : 'Sin tipo'
        };
      });

      setProducts(productosTransformados);
      setCategories(categorias);
      setSubcategories(subcategorias);
    } catch (error) {
      setAlertMessage('Error al cargar productos');
      setAlertType('error');
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    if (!search.trim()) {
      setFilteredProducts(products);
      return;
    }

    const term = search.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <View style={GLOBAL_STYLES.container}>
      {/* 📌 Animación de carga mientras se obtienen los datos */}
      <StatusBar isLoading={isLoading} />

      <CatalogSearchBar search={search} setSearch={setSearch} />
      
      {/* 📌 Mostrar clientes solo cuando la carga haya terminado */}
      {!isLoading && (
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Product product={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      )}

      <AlertModal
        isVisible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  },
});

export default CatalogScreen;
