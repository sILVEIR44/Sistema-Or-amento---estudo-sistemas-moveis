import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {styles} from "./styles";


export function Filter({...rest}) {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}>
            <Ionicons name="options" size={25} color={"#00000000"}/>
        </TouchableOpacity>
    )
}