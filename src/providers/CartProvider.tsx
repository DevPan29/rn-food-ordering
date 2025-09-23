import { CartItem, Product } from "@/types";
import { createContext, useContext, useState } from "react";

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {}
});

import { PropsWithChildren } from "react";

const CartProvider = ({ children }: PropsWithChildren) => {

    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product, size: CartItem['size']) => {
// TODO if already in cart, increment quantity

        const newCartItem: CartItem = {
            id: '1', // TODO generate unique id
            product,
            product_id: product.id,
            size,
            quantity: 1
        }

        setItems([newCartItem, ...items])
    }

    // update quantity

    return <CartContext.Provider 
    value={{
        items,
        addItem
    }}
    >
        {children}
    </CartContext.Provider>;
}

export default CartProvider;

export const useCart = () => useContext(CartContext);