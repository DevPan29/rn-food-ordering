import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables } from "@/types";

export const useInsertOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(items: InsertTables<'order_items'>[]) {
      const {error, data: newOrder} = await supabase
      .from('order_items')
      .insert(items)
      .select();
      if (error) {
        console.log('Error creating Order items: ', error);
        throw new Error('Error creating Order items');
      }
      return newOrder;
    }
  })
}