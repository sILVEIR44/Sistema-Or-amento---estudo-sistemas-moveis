import { TouchableOpacity, View, Text } from "react-native";
import { Budget } from "@/types/budget";
import { styles } from "./styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Status } from "@/types/budget";

interface Props {
    data: Budget;
    onDelete: () => void;
}

const STATUS_STYLES: Record<Status, { bg: string, color: string }> = {
    Aprovado: {
        bg: '#BFF79F',
        color: '#4BB84A',
    },
    Rascunho: {
        bg: '#E6E5E5',
        color: '#676767',
    },
    Enviado: {
        bg: '#CEEFFF',
        color: '#2AA1D9',
    },
    Recusado: {
        bg: '#FFD6D6',
        color: '#D84D4D',
    },
};

export function BudgetCard({ data, onDelete }: Props) {
    const theme = STATUS_STYLES[data.status];

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.client}>{data.cliente}</Text>
                <Text style={styles.project}>{data.projeto}</Text>
            </View>

            <View>

                <TouchableOpacity
                    onPress={onDelete}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color="#E6E5E5" />
                </TouchableOpacity>
                
                <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: theme.color }]} />
                    <Text style={[styles.statusText, { color: theme.color }]}>
                        {data.status}
                    </Text>
                </View>

                <Text style={styles.value}>R$ {data.valor.toFixed(2)}</Text>

            </View>
        </View>
    )
}