import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Budget, Servico, Status } from '@/types/budget';
import { BudgetStorage } from '@/storage/budgetStorage';
import { AppNavigationProp, NewBudgetRouteProp } from '@/types/navigation';
import {styles} from '@/app/budget/styles'

const STATUS_OPTIONS: { label: Status; bg: string; color: string }[] = [
  { label: 'Rascunho', bg: '#E6E5E5', color: '#676767' },
  { label: 'Aprovado', bg: '#BFF79F', color: '#4BB84A' },
  { label: 'Enviado',  bg: '#CEEFFF', color: '#2AA1D9' },
  { label: 'Recusado', bg: '#FFD6D6', color: '#D84D4D' },
];

interface ServicoForm {
  titulo: string;
  descricao: string;
  valor: string;
  quantidade: number;
}

const SERVICO_VAZIO: ServicoForm = { titulo: '', descricao: '', valor: '', quantidade: 1 };

export function NewBudget() {
  const navigation = useNavigation<AppNavigationProp>();
  const route      = useRoute<NewBudgetRouteProp>();
  const budgetId   = route.params?.budgetId;
  const isEditing  = !!budgetId;

  const [titulo, setTitulo]     = useState('');
  const [cliente, setCliente]   = useState('');
  const [status, setStatus]     = useState<Status>('Rascunho');
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [desconto, setDesconto] = useState('0');

  const [modalVisible, setModalVisible] = useState(false);
  const [servicoForm, setServicoForm]   = useState<ServicoForm>(SERVICO_VAZIO);
  const [editandoId, setEditandoId]     = useState<string | null>(null);

  useEffect(() => {
    if (budgetId) {
      BudgetStorage.getById(budgetId).then(budget => {
        if (budget) {
          setTitulo(budget.projeto);
          setCliente(budget.cliente);
          setStatus(budget.status);
          setServicos(budget.servicos ?? []);
          setDesconto(String(budget.desconto ?? 0));
        }
      });
    }
  }, [budgetId]);

  const subtotal      = servicos.reduce((acc, s) => acc + s.valor * s.quantidade, 0);
  const pctDesconto   = parseFloat(desconto.replace(',', '.')) || 0;
  const valorDesconto = subtotal * (pctDesconto / 100);
  const total         = subtotal - valorDesconto;
  const totalItens    = servicos.reduce((acc, s) => acc + s.quantidade, 0);

  function abrirModal(servico?: Servico) {
    if (servico) {
      setServicoForm({
        titulo:     servico.titulo,
        descricao:  servico.descricao,
        valor:      servico.valor.toString(),
        quantidade: servico.quantidade,
      });
      setEditandoId(servico.id);
    } else {
      setServicoForm(SERVICO_VAZIO);
      setEditandoId(null);
    }
    setModalVisible(true);
  }

  function fecharModal() {
    setModalVisible(false);
    setServicoForm(SERVICO_VAZIO);
    setEditandoId(null);
  }

  function salvarServico() {
    if (!servicoForm.titulo.trim()) {
      Alert.alert('Atenção', 'Informe o nome do serviço.');
      return;
    }
    const valorNumerico = parseFloat(servicoForm.valor.replace(',', '.'));
    if (!valorNumerico || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    const novoServico: Servico = {
      id:         editandoId ?? Date.now().toString(),
      titulo:     servicoForm.titulo.trim(),
      descricao:  servicoForm.descricao.trim(),
      valor:      valorNumerico,
      quantidade: servicoForm.quantidade,
    };

    if (editandoId) {
      setServicos(prev => prev.map(s => s.id === editandoId ? novoServico : s));
    } else {
      setServicos(prev => [...prev, novoServico]);
    }

    fecharModal();
  }

  function excluirServico() {
    Alert.alert('Excluir serviço', 'Deseja remover este serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          setServicos(prev => prev.filter(s => s.id !== editandoId));
          fecharModal();
        },
      },
    ]);
  }


  async function salvarOrcamento() {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Informe o título do orçamento.');
      return;
    }
    if (!cliente.trim()) {
      Alert.alert('Atenção', 'Informe o nome do cliente.');
      return;
    }

    const agora = new Date().toISOString();
    try {
      if (isEditing && budgetId) {
        const existing = await BudgetStorage.getById(budgetId);
        await BudgetStorage.update({
          id:           budgetId,
          projeto:      titulo.trim(),
          cliente:      cliente.trim(),
          status,
          servicos,
          desconto:     pctDesconto,
          valor:        total,
          criadoEm:     existing?.criadoEm ?? agora,
          atualizadoEm: agora,
        });
      } else {
        await BudgetStorage.save({
          id:           Date.now().toString(),
          projeto:      titulo.trim(),
          cliente:      cliente.trim(),
          status,
          servicos,
          desconto:     pctDesconto,
          valor:        total,
          criadoEm:     agora,
          atualizadoEm: agora,
        });
      }
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o orçamento.');
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orçamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={16} color="#6A46EB" />
            <Text style={styles.sectionTitle}>Informações gerais</Text>
          </View>
          <View style={styles.card}>
            <TextInput
              style={styles.cardInput}
              placeholder="Título"
              placeholderTextColor="#C0C0C0"
              value={titulo}
              onChangeText={setTitulo}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.cardInput}
              placeholder="Cliente"
              placeholderTextColor="#C0C0C0"
              value={cliente}
              onChangeText={setCliente}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Ionicons name="radio-button-on-outline" size={16} color="#6A46EB" />
            <Text style={styles.sectionTitle}>Status</Text>
          </View>
          <View style={styles.statusGrid}>
            {STATUS_OPTIONS.map(opt => {
              const selected = status === opt.label;
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={styles.statusOption}
                  onPress={() => setStatus(opt.label)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioOuter, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: opt.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: opt.color }]} />
                    <Text style={[styles.statusText, { color: opt.color }]}>{opt.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase-outline" size={16} color="#6A46EB" />
            <Text style={styles.sectionTitle}>Serviços inclusos</Text>
          </View>
          <View style={styles.card}>
            {servicos.map(s => (
              <TouchableOpacity
                key={s.id}
                style={styles.serviceItem}
                onPress={() => abrirModal(s)}
                activeOpacity={0.7}
              >
                <View style={styles.serviceLeft}>
                  <Text style={styles.serviceTitle}>{s.titulo}</Text>
                  <Text style={styles.serviceDesc} numberOfLines={1}>{s.descricao}</Text>
                </View>
                <View style={styles.serviceRight}>
                  <Text style={styles.serviceValue}>R$ {s.valor.toFixed(2)}</Text>
                  <Text style={styles.serviceQty}>Qt: {s.quantidade}</Text>
                </View>
                <Ionicons name="create-outline" size={18} color="#6A46EB" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addServiceBtn} onPress={() => abrirModal()}>
              <Ionicons name="add" size={20} color="#6A46EB" />
              <Text style={styles.addServiceText}>Adicionar serviço</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Ionicons name="cash-outline" size={16} color="#6A46EB" />
            <Text style={styles.sectionTitle}>Investimento</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.investRow}>
              <Text style={styles.investLabel}>Subtotal</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.investMeta}>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</Text>
                <Text style={styles.investValue}>R$ {subtotal.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.investRow}>
              <Text style={styles.investLabel}>Desconto</Text>
              <View style={styles.discountBox}>
                <TextInput
                  style={styles.discountInput}
                  value={desconto}
                  onChangeText={setDesconto}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.discountPct}>%</Text>
              </View>
              {valorDesconto > 0 && (
                <Text style={styles.discountValue}>- R$ {valorDesconto.toFixed(2)}</Text>
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.investRow}>
              <Text style={styles.totalLabel}>Valor total</Text>
              <View style={{ alignItems: 'flex-end' }}>
                {valorDesconto > 0 && (
                  <Text style={styles.strikethrough}>R$ {subtotal.toFixed(2)}</Text>
                )}
                <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={salvarOrcamento}>
            <Ionicons name="checkmark" size={20} color="#FFF" />
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={fecharModal} />
          <View style={styles.modalSheet}>

            <View style={styles.modalHandleBar} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Serviço</Text>
              <TouchableOpacity onPress={fecharModal} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Nome do serviço"
              placeholderTextColor="#999"
              value={servicoForm.titulo}
              onChangeText={t => setServicoForm(p => ({ ...p, titulo: t }))}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Descrição"
              placeholderTextColor="#999"
              value={servicoForm.descricao}
              onChangeText={t => setServicoForm(p => ({ ...p, descricao: t }))}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalValueRow}>
              <View style={styles.modalValueBox}>
                <Text style={styles.currencyLabel}>R$</Text>
                <TextInput
                  style={styles.modalValueInput}
                  placeholder="0,00"
                  placeholderTextColor="#999"
                  value={servicoForm.valor}
                  onChangeText={t => setServicoForm(p => ({ ...p, valor: t }))}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setServicoForm(p => ({ ...p, quantidade: Math.max(1, p.quantidade - 1) }))}
                >
                  <Ionicons name="remove" size={18} color="#333" />
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{servicoForm.quantidade}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setServicoForm(p => ({ ...p, quantidade: p.quantidade + 1 }))}
                >
                  <Ionicons name="add" size={18} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooter}>
              {editandoId ? (
                <TouchableOpacity style={styles.deleteBtn} onPress={excluirServico}>
                  <Ionicons name="trash-outline" size={20} color="#D84D4D" />
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <TouchableOpacity style={styles.saveBtn} onPress={salvarServico}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}