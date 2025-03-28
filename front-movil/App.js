import { StyleSheet} from 'react-native';
import LoginScreen from './src/modules/auth/LoginScreen';
import Navigation from './src/components/Navigation';

export default function App() {
  return (
    <Navigation/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
