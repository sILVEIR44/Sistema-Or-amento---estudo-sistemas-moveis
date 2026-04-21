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
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  client: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  project: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
    marginBottom: 6,
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});