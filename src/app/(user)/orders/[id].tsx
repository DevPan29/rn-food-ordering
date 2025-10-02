import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import orders from '@assets/data/orders';
import CartListItem from '@/components/CartListItems';

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  console.log(`id OrderDetailScreen`, id)
  const order = orders.find(o => o.id.toString() === id);

  if (!order) {
    return <Text>Order not found!</Text>
  }

  const getHoursAgo = () => {
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const diffInMs = now.getTime() - orderDate.getTime();
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    return diffInHours;
  }

  const hoursAgo = getHoursAgo();

  const mapOrderItems = () => {
    return order.order_items?.map(item => {
      return {
        id: item.id,
        size: item.size,
        quantity: item.quantity,
        product: item.products,
        product_id: item.product_id
      }
    })
  }

  const itemsMapped = mapOrderItems();

  return (
    <View style={styles.container}>
      <View style={styles.orderContainer}>
        <View>
            <Text style={styles.title}>Order #{order.id}</Text>
            <Text style={styles.creationDate}>{hoursAgo} hours ago</Text>
        </View>
        <Text style={styles.status}>{order.status}</Text>
      </View>
      <View style={{ padding: 10}}>
        {/* NON USARE IL CARTITEM MA FAI UN NUOVO COMPONENTE */}
        {/* <FlatList 
        data={itemsMapped} 
        renderItem={
          ({item}) => < CartListItem cartItem={item}/>
        }
        contentContainerStyle={{ gap: 10}}/> */}

    
       
       
      </View>
    </View>
  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
    padding: 10,
    flex: 1,
  },
  orderContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      creationDate: {
        color: 'gray',
        fontSize: 16,
      },
      status: {
        fontSize: 16,
      }
})