import { View, FlatList } from 'react-native';
import useWebsockets from './useWebsockets';
import { Text, Button } from 'react-native-paper';

export default function WebsocketConnections({ user }) {
  const { connections, error, requestDisconnect } = useWebsockets(user);

  return (
    <FlatList
      data={connections}
      ListHeaderComponent={() => (
        <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 8 }}>Other Websocket Connections</Text>
      )}
      ListEmptyComponent={() => {
        if (error) {
          return <Text style={{ padding: 8, color: 'red' }}>Error: {error}</Text>;
        }
        return <Text style={{ padding: 8 }}>No other active connections</Text>;
      }}
      keyExtractor={(item) => item.socketId}
      renderItem={({ item }) => (
        <View style={{ padding: 8, borderBottomWidth: 1 }}>
          <Text>Socket: {item.socketId}</Text>
          <Text>IP: {item.ip}</Text>
          <Text>UA: {item.userAgent}</Text>
          <Text>Created: {new Date(item.createdAt).toLocaleString()}</Text>
          <Button onPress={() => requestDisconnect(item.socketId)}>Disconnect</Button>
        </View>
      )}
    />
  );
}
