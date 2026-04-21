import AsyncStorage from "@react-native-async-storage/async-storage";
import { Budget } from "@/types/budget";

const STORAGE_KEY = '@sistema_orcamento:budgets';

export const BudgetStorage = {

  async get(): Promise<Budget[]> {
    try {
      const storage = await AsyncStorage.getItem(STORAGE_KEY);
      return storage ? JSON.parse(storage) : [];
    } catch (error) {
      console.error("Erro ao ler orçamentos:", error);
      return [];
    }
  },

  async getById(id: string): Promise<Budget | null> {
    try {
      const budgets = await this.get();
      return budgets.find(b => b.id === id) ?? null;
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
      return null;
    }
  },

  async save(newBudget: Budget): Promise<void> {
    try {
      const currentData = await this.get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...currentData, newBudget]));
    } catch (error) {
      console.error("Erro ao salvar:", error);
      throw error;
    }
  },

  async update(updatedBudget: Budget): Promise<void> {
    try {
      const currentData = await this.get();
      const updated = currentData.map(b =>
        b.id === updatedBudget.id
          ? { ...updatedBudget, atualizadoEm: new Date().toISOString() }
          : b
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const currentData = await this.get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(currentData.filter(b => b.id !== id))
      );
    } catch (error) {
      console.error("Erro ao deletar:", error);
      throw error;
    }
  },

  async deleteAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar banco:", error);
      throw error;
    }
  },
};