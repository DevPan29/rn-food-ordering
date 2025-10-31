import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InsertTables } from "@/types";


export const useAdminOrderList = ({archived = false}) => {

  const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];
    
  return useQuery({
        queryKey: ['orders', {archived}],
        queryFn: async () => {
          const {data, error} = await supabase
          .from('orders')
          .select('*')
          .in('status', statuses);
          if (error) {
            console.log('Error fetching orders: ', error);
            throw new Error('Error fetching orders');
          }
          return data;
        }
      });
}


export const useMyOrderList = () => {

  const {session} = useAuth();

  const id = session?.user.id;
  

     return useQuery({
        queryKey: ['orders', {userId: id}],
        queryFn: async () => {
          if (!id) return null;
          const {data, error} = await supabase.
          from('orders').
          select('*').
          eq('user_id', id);
          if (error) {
            console.log('Error fetching orders: ', error);
            throw new Error('Error fetching orders');
          }
          return data;
        }
      });
}


export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    enabled: typeof id === 'number' && !Number.isNaN(id), //ikmportant to avoid the call if id is null
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // torna null se non esiste
      if (error) {
        console.log('Error fetching order detail: ', error);
        throw new Error('Error fetching order detail');
      }
      return data; // può essere null
    }
  });
}


export const useInsertOrder = () => {
  const queryClient = useQueryClient();

  const { session } = useAuth();
  const userId = session?.user.id;


  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const {error, data: newOrder} = await supabase.from('orders')
      .insert({...data, user_id:userId})
      .select()
      .single();
      if (error) {
        console.log('Error creating product: ', error);
        throw new Error('Error creating product');
      }
      return newOrder;
    }, async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  })
}