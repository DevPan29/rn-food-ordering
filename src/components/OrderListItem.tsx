import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Order } from '@/types'
import Colors from '@/constants/Colors'
import { Link, useSegments } from 'expo-router'

type OrderListItemProp = {
    order: Order
}

const OrderListItem = ({order}: OrderListItemProp ) => {
  const segments = useSegments();

  const getHoursAgo = () => {
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const diffInMs = now.getTime() - orderDate.getTime();
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    return diffInHours;
  }

  const hoursAgo = getHoursAgo();

  return (
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
        <Pressable style={styles.container}>
            <View>
                <Text style={styles.title}>Order #{order.id}</Text>
                <Text style={styles.creationDate}>{hoursAgo} hours ago</Text>
            </View>
            <Text style={styles.status}>{order.status}</Text>
        </Pressable>
    </Link>
  )
}

export default OrderListItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
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