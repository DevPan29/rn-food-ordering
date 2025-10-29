import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useOrderList = () => {
     return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
          const {data, error} = await supabase.from('orders').select('*');
          if (error) {
            console.log('Error fetching orders: ', error);
            throw new Error('Error fetching orders');
          }
          return data;
        }
      });
}