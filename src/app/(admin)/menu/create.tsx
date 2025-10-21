import { View, Text, StyleSheet, TextInput, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '@/components/Button'
import { defaultPizzaImage } from '@/components/ProductListItem'
import Colors from '@/constants/Colors'
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/api/products'

const CreateProductScreen = () => {

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [errors, setErrors] = useState('')
    const [image, setImage] = useState<string | null>(null);

    const { id: idString } = useLocalSearchParams(); // useLoadlSearchParams can return a single value or an array
    const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
    const isUpdating = !!id;

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    
    const { mutate: deleteProduct } = useDeleteProduct();

    const router = useRouter();

    // usa anche isLoading e isError da react-query
    const { data: updatingProduct, isLoading: isProductLoading, isError: isProductError } = useProduct(id);

    // useEffect: assegna campi SOLO se updatingProduct è un oggetto valido
    useEffect(() => {
    if (!isUpdating) return; // se non stiamo aggiornando non facciamo nulla
    if (isProductLoading) return; // ancora in caricamento
    if (isProductError) return;   // opzionale: puoi mostrare errore

    if (updatingProduct) {
        setName(updatingProduct.name ?? '');
        setPrice(
        updatingProduct.price !== undefined && updatingProduct.price !== null
            ? String(updatingProduct.price)
            : ''
        );
        setImage(updatingProduct.image ?? null);
    } else {
        // prodotto non trovato (forse è stato cancellato)
        setName('');
        setPrice('');
        setImage(null);
    }
    }, [isUpdating, isProductLoading, isProductError, updatingProduct]);




    const resetFields = () => {
        setName('');
        setPrice('');
    }

    const validateInput = () => {
        setErrors('');
        if (!name) {
            setErrors('Name is required');
            return false;
        }
        if (!price) {
            setErrors('Price is required');
            return false;
        }
        if (isNaN(parseFloat(price))) {
            setErrors('Price is not a number');
            return false;
        }
        return true;
    }

    const onSubmit = () => {
    if (isUpdating) {
        onUpdate(); 
    }   else {
        onCreate();
    }   
}

const onCreate = () => {
    if (!validateInput()) {
        return;
    }
    insertProduct({
        name, price: parseFloat(price), image
    }, {
        onSuccess: () => {
            resetFields();
            router.back();
        }
    })

    // save in the database
    resetFields();
}

const onUpdate = () => {
    if (!validateInput()) {
        return;
    }
    updateProduct({ id, name, price: parseFloat(price), image }, {
        onSuccess: () => {
            resetFields();
            router.back();
        }
    })
}

const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // mediaTypes: ['images', 'videos'],
      allowsEditing: true, // with false avoid to see crop options
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onDelete = () => {
   deleteProduct(id, {
        onSuccess: () => {
            resetFields();
            router.replace('/(admin)');
        }
    })
  }

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
        { text: "Cancel" },
        { text: "Delete", 
            style: 'destructive',
            onPress: onDelete 
        },
    ])
  }

  return (
    <View style={styles.container}>
        <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}/>
    <Image source={{uri: image || defaultPizzaImage}} 
    style={styles.image} />
    <Text onPress={pickImage} style={styles.textButton}>Select Image</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput 
        value={name}
        onChangeText={setName}
        placeholder='Name' 
        style={styles.input}/>

    <Text style={styles.label}>Price ($)</Text>
      <TextInput 
        value={price}
        onChangeText={setPrice}
        placeholder='9.99' 
        style={styles.input}
        keyboardType="numeric"/>
        <Text style={{color: 'red'}}>{errors}</Text>
        <Button onPress={onSubmit} text={isUpdating ? 'Update' : 'Create'}></Button>
        { isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10
    },
        input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20
    },label: {
        color: 'gray',
        fontSize: 16
    }
})

export default CreateProductScreen