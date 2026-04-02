import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: "center"
    },

    client: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    project: {
        fontSize: 14,
        color: '#666'
    },

    value: {
        fontSize: 16,
        fontWeight: 'bold'
    },

    status: {
        fontSize: 12,
        marginTop: 4
    },

    approved: {
        color: 'green'
    },

    draft: {
        color: 'gray'
    },

    deleteButton: {
        marginLeft: 15,
        marginBottom: 5,
        padding: 5,
        alignItems: 'flex-end'
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    }
}
)