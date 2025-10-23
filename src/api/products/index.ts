import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductList = () => {
     return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
          const {data, error} = await supabase.from('products').select('*');
          if (error) {
            console.log('Error fetching products: ', error);
            throw new Error('Error fetching products');
          }
          return data;
        }
      });
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    enabled: typeof id === 'number' && !Number.isNaN(id), //ikmportant to avoid the call if id is null
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // torna null se non esiste
      if (error) {
        console.log('Error fetching product: ', error);
        throw new Error('Error fetching product');
      }
      return data; // può essere null
    }
  });
}


export const useInsertProduct = () => {
  const queryClient = useQueryClient();


  return useMutation({
    async mutationFn(data: any) {
      const {error, data: newProduct} = await supabase.from('products')
      .insert({
        name: data.name,
        image: data.image,
        price: data.price
      })
      .single();
      if (error) {
        console.log('Error creating product: ', error);
        throw new Error('Error creating product');
      }
      return newProduct;
    }, async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const {error, data: updatedProduct} = await supabase.from('products')
      .update({
        name: data.name,
        image: data.image,
        price: data.price
      })
      .eq('id', data.id)
      .select()
      .single();
      if (error) {
        console.log('Error updating product: ', error);
        throw new Error('Error updating product');
      }
      return updatedProduct;
    // }, async onSuccess(_ , data) { we prefer to distructure data and get just the id
    }, async onSuccess(_ , { id }) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['products', id] });
    }
  })

}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) {
          console.log('Error deleting a product: ', error);
          throw new Error('Error deleting a product');
        }
    }, async onSuccess(_, id) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      console.log(`Deleted product with id: ${id}`);
      if (id) {
       await queryClient.invalidateQueries({ queryKey: ['products', id] }); 
      }
    }
  })
}