import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import { BudgetCard } from "@/components/budgetCard";
import { Budget } from "@/types/budget";
import { styles } from "@/app/home/styles";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Filter } from "@/components/filter";
import { BudgetStorage } from "@/storage/budgetStorage";

export function Home() {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    async function fetchBudgets() {
        const data = await BudgetStorage.get();
        setBudgets(data);
    }

    useEffect(() => {
        fetchBudgets();
    }, []);

    async function handleTestSave() {
    try {
        const idAleatorio = Math.floor(Math.random() * 1000).toString();
        
        const mockBudget: Budget = {
            id: idAleatorio,
            cliente: `Cliente Teste ${idAleatorio}`,
            projeto: "Projeto via Botão Teste",
            valor: 999.90,
            status: "Rascunho"
        };

        console.log("Tentando salvar...", mockBudget);
        
        await BudgetStorage.save(mockBudget);
        
        console.log("Salvo com sucesso!");
        
        // Recarrega a lista para ver o item aparecer na hora
        await fetchBudgets(); 

    } catch (error) {
        console.error("Erro no teste:", error);
    }
}

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Orçamentos</Text>
                    <Text>Você tem 1 item em rascunho</Text>
                </View>
                <Button title="Novo" onPress={handleTestSave}/>
            </View>
            <View style={styles.input}>
                <Input placeholder="Título ou Cliente" />
                <Filter />
            </View>
            <FlatList
                data={budgets}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <BudgetCard data={item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </View>
    )
}