import { View, FlatList } from 'react-native';
import products from '@assets/data/products';
import ProductListItem from '@components/ProductListItem';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MenuScreen() {

  useEffect(() => {
    console.log('MenuScreen index.tsx rendered');
    const fetchProducts = async () => {
      const {data, error} = await supabase.from('products').select('*');
      console.log('Fetching products error: ', error);
      console.log('Fetching products data: ', data);
    } 
    fetchProducts();
  }, [])


  return (
  <View>
      <FlatList 
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
  </View>)
}


