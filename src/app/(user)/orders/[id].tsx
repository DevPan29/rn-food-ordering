import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import OrderItemListItem from '../../../components/OrderItemListItem';
import OrderListItem from '../../../components/OrderListItem';
import { useOrderDetails } from '@/api/orders';

const OrderDetailScreen = () => {
  const { id: idString } = useLocalSearchParams(); // useLoadlSearchParams can return a single value or an array
      const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
  
    const {data: order, isLoading, error} = useOrderDetails(id);
  
    if (isLoading) {
      return <ActivityIndicator />;
    }
  
    if (error) {
      return <View><Text>Error loading products</Text></View>;
    }
  
    if (!order){
      return <Text>Order not found</Text>
    }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});

export default OrderDetailScreen;