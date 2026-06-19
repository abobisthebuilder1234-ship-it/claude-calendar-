import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarScreen from './calendar';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarScreen />
    </SafeAreaView>
  );
}
