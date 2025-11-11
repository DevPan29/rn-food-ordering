import OrderListItem from '../../../../components/OrderListItem';
import { Stack } from 'expo-router';
import { useAdminOrderList } from '@/api/orders';
import { ActivityIndicator, Text, FlatList } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function OrdersScreen() {

  const { data: orders, isLoading, error} = useAdminOrderList({archived: false});

  const queryClient = useQueryClient();

  useEffect(() => {
  const channel = supabase
    .channel('orders-changes') // nome arbitrario
    .on(
      'postgres_changes',
      {
        event: '*',  // ascolta INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        console.log('Change received!', payload);
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

    
  /* const orderSubscription = supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        console.log('Change received!', payload);
        queryClient.invalidateQueries(['orders']);
      }
    )
    .subscribe();

    return () => {
      orderSubscription.unsubscribe();
    }
    }, []); */

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Failed to fetch</Text>
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Orders' }} />
      <FlatList
        data={orders}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </>
  );
}