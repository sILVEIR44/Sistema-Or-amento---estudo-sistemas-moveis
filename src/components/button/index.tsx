import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import {styles} from "./styles";

type Props = TouchableOpacityProps & {
    title: string
}

export function Button({title, ...rest}: Props) {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}>
            <MaterialIcons name="add" size={20} color={"#FFFFFF"}/>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}