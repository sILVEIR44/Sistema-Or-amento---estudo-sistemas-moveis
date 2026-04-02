import { TouchableOpacity,View, Text} from "react-native";
import {Budget} from "@/types/budget";
import {styles} from "./styles";
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
    data: Budget;
    onDelete: () => void;
}

export function BudgetCard({data, onDelete}:Props) {
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
                <Ionicons name="trash-outline" size={20} color="#E6E5E5"/>
            </TouchableOpacity>
            <Text style={styles.status}>{data.status}</Text>
            <Text style={styles.value}>R$ {data.valor.toFixed(2)}</Text>
            
        </View>
    </View>
    )
}