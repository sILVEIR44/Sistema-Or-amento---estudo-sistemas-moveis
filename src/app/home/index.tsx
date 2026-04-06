import { useEffect, useState } from "react";
import { FlatList, View, Text, Alert } from "react-native";
import { BudgetCard } from "@/components/budgetCard";
import { Budget } from "@/types/budget";
import { styles } from "@/app/home/styles";
import { Button, ClearAll } from "@/components/button";
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
                status: "Aprovado"
            };

            console.log("Tentando salvar...", mockBudget);

            await BudgetStorage.save(mockBudget);

            console.log("Salvo com sucesso!");

            await fetchBudgets();

        } catch (error) {
            console.error("Erro no teste:", error);
        }
    }

    async function handleDeleteBudget(id: string) {
        Alert.alert(
            "Excluir orçamento",
            "Tem certeza que deseja excluir esse orçamento? Essa ação não poderá ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim, excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await BudgetStorage.delete(id);
                            await fetchBudgets();
                            console.log("Item removido com sucesso");
                        } catch (error) {
                            console.error("Não foi possível deletar:", error);
                        }
                    }
                }

            ]

        );
    }

    async function handleClearAll() {
        Alert.alert(
            "Limpar Tudo",
            "Realmente deseja excluir TODOS os orçamentos? Essa ação é irreversível.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim, excluir TODOS os orçamentos",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await BudgetStorage.deleteAll();
                            await fetchBudgets();
                            console.log("Banco limpo com sucesso");
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível limpar os dados.");
                        }
                    }
                }
            ]
        )
    }



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Orçamentos</Text>
                    <Text>Você tem 1 item em rascunho</Text>
                </View>
                <Button title="Novo" onPress={handleTestSave} />
            </View>
            <View style={styles.input}>
                <Input placeholder="Título ou Cliente" />
                <Filter />
            </View>
            <View>
                <ClearAll title="Limpar" onPress={handleClearAll} />
            </View>
            <FlatList
                data={budgets}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <BudgetCard data={item}
                    onDelete={() => handleDeleteBudget(item.id)} />}
                contentContainerStyle={{ paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </View>
    )
}