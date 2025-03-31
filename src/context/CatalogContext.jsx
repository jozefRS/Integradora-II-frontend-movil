import React, { createContext, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const CatalogContext = createContext();

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Función para cargar productos, categorías, subcategorías desde la API
  const fetchAllData = async () => {
    try {
      // Podrías mostrar un loader global si quieres
      const [prodRes, catRes, subcatRes] = await Promise.all([
        axiosInstance.get('/producto'),
        axiosInstance.get('/categoria'),
        axiosInstance.get('/subcategoria'),
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
      console.error('Error al cargar el catálogo:', error);
      // Manejo de errores, si gustas
    }
  };

  // Función para actualizar stock localmente tras una venta
  const updateStock = (updates) => {
    // updates es un array de { productId, quantitySold }, o un objeto si vendes un solo producto
    // Por ejemplo: [{ productId: 'abc123', quantitySold: 2 }, ...]
    setProducts((prev) =>
      prev.map((p) => {
        const match = updates.find(u => u.productId === p.id);
        if (match) {
          const newStock = p.stock - match.quantitySold;
          return {
            ...p,
            stock: newStock,
            available: newStock > 0,
          };
        }
        return p;
      })
    );
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        subcategories,
        fetchAllData,
        updateStock,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};
