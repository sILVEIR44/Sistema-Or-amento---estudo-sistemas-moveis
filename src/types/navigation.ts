import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Status } from './budget';

export type OrderBy = 'recente' | 'antigo' | 'maior' | 'menor';

export interface FilterState {
  statuses: Status[];
  orderBy: OrderBy;
}

export const FILTER_DEFAULT: FilterState = {
  statuses: [],
  orderBy: 'recente',
};

export type RootStackParamList = {
  Home: { appliedFilters?: FilterState } | undefined;
  Filter: { currentFilters: FilterState };
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type FilterRouteProp   = RouteProp<RootStackParamList, 'Filter'>;
export type HomeRouteProp     = RouteProp<RootStackParamList, 'Home'>; 