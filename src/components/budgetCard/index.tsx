import {View, Text} from "react-native";
import {Budget} from "@/types/budget";
import {styles} from "./styles"

interface Props {
    data: Budget
}

export function BudgetCard({data}:Props) {
    return (
    <View style={styles.container}>
        <View>
            <Text style={styles.client}>{data.cliente}</Text>
            <Text style={styles.project}>{data.projeto}</Text>
        </View>

        <View>
            <Text style={styles.status}>{data.status}</Text>
            <Text style={styles.value}>R$ {data.valor.toFixed(2)}</Text>
        </View>
    </View>
    )
}