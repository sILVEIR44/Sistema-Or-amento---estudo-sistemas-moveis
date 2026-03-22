import AsyncStorage from "@react-native-async-storage/async-storage";
import { Budget, Status } from "@/types/budget";

const STORAGE_KEY = '@sistema_orcamento:budgets';

export const BudgetStorage = {

    async get(): Promise<Budget[]> {
        try {
            const storage = await AsyncStorage.getItem(STORAGE_KEY);
            return storage ? JSON.parse(storage) : [];
        } catch (error) {
            console.error("Erro ao let orçamentos:", error);
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
}

}