import { FlatList, StyleSheet, Text, View } from 'react-native'
import orders from '@assets/data/orders';
import React from 'react'
import OrderListItem from '@/components/OrderListItem';

const OrdersScreen = () => {
    console.log(`orders`, orders)
  return (
    <View>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      ></FlatList>
    </View>
  )
}

export default OrdersScreen

const styles = StyleSheet.create({})