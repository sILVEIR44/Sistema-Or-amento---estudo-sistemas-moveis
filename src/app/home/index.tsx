import { useEffect, useState, useMemo } from "react";
import { FlatList, View, Text, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BudgetCard } from "@/components/budgetCard";
import { Budget } from "@/types/budget";
import { styles } from "@/app/home/styles";
import { Button, ClearAll } from "@/components/button";
import { Input } from "@/components/input";
import { Filter } from "@/components/filter";
import { BudgetStorage } from "@/storage/budgetStorage";
import {
  AppNavigationProp, HomeRouteProp,
  FilterState, FILTER_DEFAULT,
} from "@/types/navigation";

export function Home() {
  const navigation = useNavigation<AppNavigationProp>();
  const route      = useRoute<HomeRouteProp>();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState<FilterState>(FILTER_DEFAULT);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBudgets);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.appliedFilters) {
      setFilters(route.params.appliedFilters);
    }
  }, [route.params?.appliedFilters]);

  async function fetchBudgets() {
    const data = await BudgetStorage.get();
    setBudgets(data);
  }

  const filteredBudgets = useMemo(() => {
    let result = [...budgets];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        b => b.projeto.toLowerCase().includes(term) || b.cliente.toLowerCase().includes(term)
      );
    }

    if (filters.statuses.length > 0) {
      result = result.filter(b => filters.statuses.includes(b.status));
    }

    switch (filters.orderBy) {
      case 'recente': result.sort((a, b) => b.id.localeCompare(a.id)); break;
      case 'antigo':  result.sort((a, b) => a.id.localeCompare(b.id)); break;
      case 'maior':   result.sort((a, b) => b.valor - a.valor); break;
      case 'menor':   result.sort((a, b) => a.valor - b.valor); break;
    }

    return result;
  }, [budgets, search, filters]);

  const activeFilterCount =
    filters.statuses.length + (filters.orderBy !== FILTER_DEFAULT.orderBy ? 1 : 0);

  async function handleDeleteBudget(id: string) {
    Alert.alert("Excluir orçamento", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, excluir",
        style: "destructive",
        onPress: async () => {
          await BudgetStorage.delete(id);
          await fetchBudgets();
        },
      },
    ]);
  }

  async function handleClearAll() {
    Alert.alert("Limpar Tudo", "Deseja excluir TODOS os orçamentos?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, excluir TODOS",
        style: "destructive",
        onPress: async () => {
          await BudgetStorage.deleteAll();
          await fetchBudgets();
        },
      },
    ]);
  }

  const rascunhos = budgets.filter(b => b.status === 'Rascunho').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Orçamentos</Text>
          <Text>
            {rascunhos === 0
              ? 'Nenhum item em rascunho'
              : `Você tem ${rascunhos} item${rascunhos > 1 ? 's' : ''} em rascunho`}
          </Text>
        </View>
        <Button title="Novo" onPress={() => navigation.navigate('NewBudget')} />
      </View>

      <View style={styles.input}>
        <Input placeholder="Título ou Cliente" value={search} onChangeText={setSearch} />
        <Filter
          activeCount={activeFilterCount}
          onPress={() => navigation.navigate('Filter', { currentFilters: filters })}
        />
      </View>

      <View style={styles.limpar}>
        <ClearAll title="Limpar" onPress={handleClearAll} />
      </View>

      <FlatList
        data={filteredBudgets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BudgetCard
            data={item}
            onPress={() => navigation.navigate('BudgetDetail', { budgetId: item.id })}
            onDelete={() => handleDeleteBudget(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
            {search || filters.statuses.length > 0
              ? 'Nenhum resultado encontrado'
              : 'Nenhum orçamento cadastrado'}
          </Text>
        }
      />
    </View>
  );
}