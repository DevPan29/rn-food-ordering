import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Product } from '../types';

import Colors from '../constants/Colors';
import { Link, useSegments } from 'expo-router';

export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png'

type ProductListItemProps = {
  product: Product | null;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();

  if (!product) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <Text style={{ color: 'gray' }}>Product not available</Text>
      </View>
    );
  }

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image 
          source={{ uri: product.image || defaultPizzaImage }} 
          style={styles.image}
          resizeMode='contain'
          />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>
        
      </Pressable>
    </Link>
  );
}

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    maxWidth: '50%'
  },
  image: {
    width: '100%',
    aspectRatio: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold'
  }
});
