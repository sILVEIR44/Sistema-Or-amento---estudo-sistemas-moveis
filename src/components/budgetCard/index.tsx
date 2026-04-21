import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Budget, Status } from "@/types/budget";
import Ionicons from '@expo/vector-icons/Ionicons';
import {styles} from '@/components/budgetCard/styles'

interface Props {
  data: Budget;
  onDelete: () => void;
  onPress: () => void;
}

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  Aprovado: { bg: '#BFF79F', color: '#4BB84A' },
  Rascunho: { bg: '#E6E5E5', color: '#676767' },
  Enviado:  { bg: '#CEEFFF', color: '#2AA1D9' },
  Recusado: { bg: '#FFD6D6', color: '#D84D4D' },
};

export function BudgetCard({ data, onDelete, onPress }: Props) {
  const theme = STATUS_STYLES[data.status];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={{ flex: 1 }}>
        <Text style={styles.client}>{data.cliente}</Text>
        <Text style={styles.project}>{data.projeto}</Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={18} color="#C3C5CB" />
        </TouchableOpacity>

        <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: theme.color }]} />
          <Text style={[styles.statusText, { color: theme.color }]}>{data.status}</Text>
        </View>

        <Text style={styles.value}>R$ {data.valor.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}