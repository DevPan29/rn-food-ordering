import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useInsertOrderSubscription = () => {
    const queryClient = useQueryClient();
    
      useEffect(() => {
      const channel = supabase
        .channel('custom-insert-channel') // nome arbitrario
        .on(
          'postgres_changes',
          {
            event: 'INSERT',  // ascolta INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'orders',
          },
          (payload) => {
            console.log('Change received!', payload);
            queryClient.invalidateQueries(['orders']);
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    
      return () => {
        // this function will be called when the component unmounts
        supabase.removeChannel(channel);
      };
    }, []);
}

export const useUpdateOrderSubscription = (id: number) => {
    const queryClient = useQueryClient();
    useEffect(() => {
  const orders = supabase
    .channel('custom-filter-channel')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${id}`,
      },
      (payload) => {
        console.log('Update Change received!', payload);
        queryClient.invalidateQueries(['orders', id]);
      }
    )
    .subscribe();

  return () => {
    orders.unsubscribe();
  };
}, []);
}