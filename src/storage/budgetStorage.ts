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

  async save(newBudget: Budget): Promise<void> {
    try {
      const currentData = await this.get();
      const updateData = [...currentData, newBudget];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updateData));
    } catch (error) {
      console.error("Erro ao salvar:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const currentData = await this.get();
      const updateData = currentData.filter(budget => budget.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updateData));
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