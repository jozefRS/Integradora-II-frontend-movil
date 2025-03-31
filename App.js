import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/components/Navigation';
import { CatalogProvider } from './src/context/CatalogContext';

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
      <Navigation />
      </CatalogProvider>
    </AuthProvider>
  );
}
