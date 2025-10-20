import { Image, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import products from '@assets/data/products';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useProduct } from '@/api/products';

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams(); // useLoadlSearchParams can return a single value or an array
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);

  const {data: product, error, isLoading} = useProduct(id);
  const { addItem } = useCart();

  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

  // const product = products.find(p => p.id.toString() === id);

  const addToCart = () => {
    if (!product) return
    addItem(product!, selectedSize as any);
    router.push('/cart')
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <View><Text>Error loading product</Text></View>;
  }

  return (
    <View style={styles.container}>
       <Stack.Screen 
       options={{ 
      title: 'Menu',
      headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ) }} />
      <Stack.Screen options={{ title: product?.name }}/>
      <Image source={{ uri: product.image || defaultPizzaImage}} style={styles.image}/>
      

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      {/* <Button text="Add to cart" onPress={addToCart} /> */}
    </View>
  )
}

export default ProductDetailsScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    aspectRatio: 1
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})