import { useState } from "react";
import { FlatList, View, Text } from "react-native";
import { BudgetCard } from "@/components/budgetCard";
import { Budget } from "@/types/budget";
import { styles } from "@/app/home/styles";

export function Home() {
    const [budgets, setBudgets] = useState<Budget[]>([
        { id: '1', cliente: 'Apple Computer', projeto: 'Projeto de Identidade', valor: 4500, data: '10/10', status: 'Aprovado' },
        { id: '2', cliente: 'Mesa de Jantar', projeto: 'Móveis Planejados', valor: 1200, data: '11/10', status: 'Recusado' },
    ]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Orçamentos</Text>
            <Text>Você tem 1 item em rascunho</Text>
            <FlatList
                data={budgets}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <BudgetCard data={item} />}
                contentContainerStyle={{paddingBottom: 20}}
                ItemSeparatorComponent={() => <View style={{ height: 10 }}/>}
            />
        </View>
    )
}