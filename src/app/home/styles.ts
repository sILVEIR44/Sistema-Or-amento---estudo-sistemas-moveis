import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingTop: 60
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#6A46EB'
    },
    header: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E5E5',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    limpar: {
        justifyContent: "center",
        paddingBottom: 10
    },

    alert: {
        justifyContent: "space-between"
    }
})