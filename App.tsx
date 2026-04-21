import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Home } from '@/app/home';
import { FilterScreen } from '@/app/filterScreen';
import { NewBudget } from '@/app/budget/index';
import { BudgetDetail } from '@/app/budget/detail/index';
import type { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="NewBudget" component={NewBudget} />
        <Stack.Screen name="BudgetDetail" component={BudgetDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}