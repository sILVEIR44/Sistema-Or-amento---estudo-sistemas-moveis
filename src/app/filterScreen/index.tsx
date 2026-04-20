import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Status } from '@/types/budget';
import {FilterState, FilterRouteProp, AppNavigationProp, FILTER_DEFAULT, OrderBy} from '@/types/navigation';
import {styles} from '@/app/filterScreen/styles'

const STATUS_OPTIONS: { label: Status; bg: string; color: string }[] = [
  { label: 'Rascunho', bg: '#E6E5E5', color: '#676767' },
  { label: 'Enviado',  bg: '#CEEFFF', color: '#2AA1D9' },
  { label: 'Aprovado', bg: '#BFF79F', color: '#4BB84A' },
  { label: 'Recusado', bg: '#FFD6D6', color: '#D84D4D' },
];

const ORDER_OPTIONS: { label: string; value: OrderBy }[] = [
  { label: 'Mais recente', value: 'recente' },
  { label: 'Mais antigo',  value: 'antigo'  },
  { label: 'Maior valor',  value: 'maior'   },
  { label: 'Menor valor',  value: 'menor'   },
];

export function FilterScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<FilterRouteProp>();

  const { currentFilters } = route.params;

  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(currentFilters.statuses);
  const [orderBy, setOrderBy] = useState<OrderBy>(currentFilters.orderBy);

  function toggleStatus(status: Status) {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }

  function handleReset() {
    setSelectedStatuses(FILTER_DEFAULT.statuses);
    setOrderBy(FILTER_DEFAULT.orderBy);
  }

  function handleApply() {
    navigation.navigate('Home', {
      appliedFilters: { statuses: selectedStatuses, orderBy },
    });
  }

  return (
    <View style={styles.overlay}>

      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.sheet}>

        <View style={styles.handleBar} />

        <View style={styles.header}>
          <Text style={styles.title}>Filtrar e ordenar</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={styles.sectionLabel}>Status</Text>

          {STATUS_OPTIONS.map(({ label, bg, color }) => {
            const checked = selectedStatuses.includes(label);
            return (
              <TouchableOpacity
                key={label}
                style={styles.checkboxRow}
                onPress={() => toggleStatus(label)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                  {checked && <Ionicons name="checkmark" size={13} color="#FFF" />}
                </View>
                <View style={[styles.badge, { backgroundColor: bg }]}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <Text style={[styles.badgeText, { color }]}>{label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <Text style={styles.sectionLabel}>Ordenação</Text>

          {ORDER_OPTIONS.map(({ label, value }) => {
            const selected = orderBy === value;
            return (
              <TouchableOpacity
                key={value}
                style={styles.radioRow}
                onPress={() => setOrderBy(value)}
                activeOpacity={0.7}
              >
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 12 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Resetar filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Ionicons name="checkmark" size={18} color="#FFF" />
            <Text style={styles.applyText}>Aplicar</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}