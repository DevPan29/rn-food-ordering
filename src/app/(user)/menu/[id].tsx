import { Image, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { useProduct } from '@/api/products';
import RemoteImage from '@/components/RemoteImage';

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

  if (!product) {
    return <View><Text>Product not found</Text></View>;
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }}/>
      <RemoteImage 
      path={product.image}
      fallback={defaultPizzaImage}
      style={styles.image}/>
      <Text >Select size</Text>
      <View style={styles.sizes}>
      {sizes.map(size => 
        <Pressable key={size} 
            onPress={() => setSelectedSize(size)} 
            style={[styles.size, { backgroundColor: selectedSize === size ? 'gainsboro' : 'white'}]} >
          <Text 
            style={[styles.sizeText, { color: selectedSize === size ? 'black' : 'grey'}]}>{size}</Text>
        </Pressable>
      )}
      </View>

      <Text style={styles.price}>${product.price}</Text>
      <Button text="Add to cart" onPress={addToCart} />
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
  image: {
    width: '100%',
    aspectRatio: 1
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto'
  },
  sizes : {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500'
  },
})