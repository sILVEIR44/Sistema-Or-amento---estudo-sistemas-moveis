import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, Share, StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Budget } from '@/types/budget';
import { BudgetStorage } from '@/storage/budgetStorage';
import { AppNavigationProp, BudgetDetailRouteProp } from '@/types/navigation';

const STATUS_THEME: Record<string, { bg: string; color: string }> = {
  Aprovado: { bg: '#BFF79F', color: '#4BB84A' },
  Rascunho: { bg: '#E6E5E5', color: '#676767' },
  Enviado:  { bg: '#CEEFFF', color: '#2AA1D9' },
  Recusado: { bg: '#FFD6D6', color: '#D84D4D' },
};

function formatDate(isoString?: string): string {
  if (!isoString) return '--/--/----';
  return new Date(isoString).toLocaleDateString('pt-BR');
}

function formatBudgetNumber(id: string): string {
  return id.slice(-5).padStart(5, '0');
}

export function BudgetDetail() {
  const navigation = useNavigation<AppNavigationProp>();
  const route      = useRoute<BudgetDetailRouteProp>();
  const { budgetId } = route.params;

  const [budget, setBudget]   = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recarrega ao voltar da tela de edição
    const unsubscribe = navigation.addListener('focus', loadBudget);
    return unsubscribe;
  }, [navigation]);

  async function loadBudget() {
    const data = await BudgetStorage.getById(budgetId);
    setBudget(data);
    setLoading(false);
  }

  async function handleDelete() {
    Alert.alert('Excluir orçamento', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await BudgetStorage.delete(budgetId);
          navigation.goBack();
        },
      },
    ]);
  }

  async function handleCopy() {
    if (!budget) return;
    await BudgetStorage.save({
      ...budget,
      id:           Date.now().toString(),
      projeto:      `${budget.projeto} (cópia)`,
      criadoEm:     new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    });
    Alert.alert('Sucesso', 'Orçamento duplicado!');
    navigation.goBack();
  }

  async function handleShare() {
    if (!budget) return;
    const servicos = budget.servicos ?? [];
    const servicosText = servicos
      .map(s => `• ${s.titulo}: R$ ${s.valor.toFixed(2)} (Qt: ${s.quantidade})`)
      .join('\n');

    await Share.share({
      title: `Orçamento - ${budget.projeto}`,
      message:
        `*${budget.projeto}*\n` +
        `Cliente: ${budget.cliente}\n` +
        `Status: ${budget.status}\n\n` +
        `Serviços:\n${servicosText || 'Nenhum'}\n\n` +
        `Total: R$ ${budget.valor.toFixed(2)}`,
    });
  }

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color="#6A46EB" size="large" />
      </View>
    );
  }

  if (!budget) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#999' }}>Orçamento não encontrado.</Text>
      </View>
    );
  }

  const theme         = STATUS_THEME[budget.status] ?? { bg: '#E6E5E5', color: '#676767' };
  const servicos      = budget.servicos ?? [];
  const subtotal      = servicos.reduce((acc, s) => acc + s.valor * s.quantidade, 0);
  const valorDesconto = subtotal * ((budget.desconto ?? 0) / 100);

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Orçamento #{formatBudgetNumber(budget.id)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: theme.color }]} />
          <Text style={[styles.statusText, { color: theme.color }]}>{budget.status}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Card do projeto */}
        <View style={styles.projectCard}>
          <View style={styles.projectIcon}>
            <Ionicons name="document-text" size={24} color="#6A46EB" />
          </View>
          <Text style={styles.projectTitle}>{budget.projeto}</Text>
        </View>

        {/* Card de informações */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Cliente</Text>
          <Text style={styles.infoValue}>{budget.cliente}</Text>
          <View style={styles.divider} />
          <View style={styles.datesRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Criado em</Text>
              <Text style={styles.infoValue}>{formatDate(budget.criadoEm)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Atualizado em</Text>
              <Text style={styles.infoValue}>{formatDate(budget.atualizadoEm)}</Text>
            </View>
          </View>
        </View>

        {/* Serviços inclusos */}
        <View style={styles.sectionHeader}>
          <Ionicons name="briefcase-outline" size={16} color="#6A46EB" />
          <Text style={styles.sectionTitle}>Serviços inclusos</Text>
        </View>
        <View style={styles.card}>
          {servicos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum serviço adicionado</Text>
          ) : (
            servicos.map((s, index) => (
              <View
                key={s.id}
                style={[styles.serviceItem, index < servicos.length - 1 && styles.serviceItemBorder]}
              >
                <View style={styles.serviceLeft}>
                  <Text style={styles.serviceTitle}>{s.titulo}</Text>
                  <Text style={styles.serviceDesc}>{s.descricao}</Text>
                </View>
                <View style={styles.serviceRight}>
                  <Text style={styles.serviceValue}>R$ {s.valor.toFixed(2)}</Text>
                  <Text style={styles.serviceQty}>Qt: {s.quantidade}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Investimento */}
        <View style={styles.card}>
          <View style={styles.investRow}>
            <Text style={styles.investLabel}>Subtotal</Text>
            <Text style={styles.investValue}>R$ {subtotal.toFixed(2)}</Text>
          </View>

          {(budget.desconto ?? 0) > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.investRow}>
                <Text style={styles.investLabel}>Desconto</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{budget.desconto}% off</Text>
                  </View>
                  <Text style={styles.discountValue}>- R$ {valorDesconto.toFixed(2)}</Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />
          <View style={styles.investRow}>
            <Text style={styles.totalLabel}>Investimento total</Text>
            <Text style={styles.totalValue}>R$ {budget.valor.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Barra de ações */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="#D84D4D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
          <Ionicons name="copy-outline" size={22} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('NewBudget', { budgetId })}
        >
          <Ionicons name="create-outline" size={22} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#FFF" />
          <Text style={styles.shareText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1, textAlign: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20 },
  projectCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  projectIcon: { width: 50, height: 50, backgroundColor: '#F0EDFF', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  projectTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#333', lineHeight: 22 },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoLabel: { fontSize: 12, color: '#999', marginBottom: 3 },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#333' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  datesRow: { flexDirection: 'row', gap: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#6A46EB' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyText: { textAlign: 'center', color: '#999', padding: 20, fontSize: 14 },
  serviceItem: { flexDirection: 'row', padding: 14 },
  serviceItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  serviceLeft: { flex: 1, marginRight: 12 },
  serviceTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  serviceDesc: { fontSize: 12, color: '#999', marginTop: 3, lineHeight: 18 },
  serviceRight: { alignItems: 'flex-end' },
  serviceValue: { fontSize: 14, fontWeight: '700', color: '#333' },
  serviceQty: { fontSize: 12, color: '#999', marginTop: 2 },
  investRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  investLabel: { fontSize: 14, color: '#666' },
  investValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  discountBadge: { backgroundColor: '#BFF79F', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  discountBadgeText: { fontSize: 11, fontWeight: '700', color: '#4BB84A' },
  discountValue: { fontSize: 14, fontWeight: '600', color: '#D84D4D' },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#333' },
  totalValue: { fontSize: 16, fontWeight: '700', color: '#333' },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E6E5E5', alignItems: 'center', justifyContent: 'center' },
  shareBtn: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#6A46EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  shareText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});