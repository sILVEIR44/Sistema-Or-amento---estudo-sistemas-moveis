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
        shadowOpacity:0.1,
        shadowRadius:4,
        alignItems: "center"
    },

    client: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    } ,

    project: {
        fontSize: 14,
        color: '#666'
    },

    rightContent: {
        alignItems: 'center',
        flexDirection: 'row'
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
        padding: 5,
        alignItems: 'flex-end'
    }
}
)