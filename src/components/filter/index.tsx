import { TouchableOpacity, TouchableOpacityProps, View, Text, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {styles} from "@/components/filter/styles"

interface FilterProps extends TouchableOpacityProps {
  activeCount?: number;
}

export function Filter({ activeCount = 0, ...rest }: FilterProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}>
      <Ionicons name="options" size={20} color="#333" />
      {activeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}