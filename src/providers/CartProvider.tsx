import { CartItem, Product } from "@/types";
import { createContext, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";



type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void,
    updateQuantity: (itemId: string, amount: -1 | 1) => void,
    total: number,
    checkout: () => void
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
    total: 0,
    checkout: () => {}
});

import { PropsWithChildren } from "react";
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";

const CartProvider = ({ children }: PropsWithChildren) => {

    const [items, setItems] = useState<CartItem[]>([]);

    const {mutate: insertOrder} = useInsertOrder();
    const router = useRouter();

    const addItem = (product: Product, size: CartItem['size']) => {

        const existingItem = items.find(item => 
            item.product.id === product.id && item.size === size);

        if (existingItem) {
            // update quantity  
            updateQuantity(existingItem.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(), 
            product,
            product_id: product.id,
            size,
            quantity: 1
        }

        setItems([newCartItem, ...items])
    }

    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        setItems(items.map((item) => item.id !== itemId ? item : {
            ...item, quantity: item.quantity + amount
        }).filter(item => item.quantity > 0))
    }

    const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const clearCart = () => {
        setItems([]);
    }

    const checkout = () => {
        console.warn('Checkout');
        insertOrder({ total }, {
            onSuccess: (data) => {
                clearCart();
                router.push(`/(user)/orders/${data.id}`);
            }
        })
    }

    return <CartContext.Provider 
    value={{
        items,
        addItem,
        updateQuantity,
        total,
        checkout
    }}
    >
        {children}
    </CartContext.Provider>;
}

export default CartProvider;

export const useCart = () => useContext(CartContext);