import { FC, ReactNode, useReducer } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces/cart';

export interface CartState {
    cart: ICartProduct[];
}


const Cart_INITIAL_STATE: CartState = {
    cart: [],
}


export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, Cart_INITIAL_STATE);

    const onAddProductToCart = (productInCart: ICartProduct) => {

        let productExist = state.cart.find(product => product._id === productInCart._id && product.size === productInCart.size);
        if (!productExist) {
            return dispatch({ type: '[Cart] - Add product', payload: [...state.cart, productInCart] })
        }

        const updatedProducts = state.cart.map(p => {
            if (p._id !== productInCart._id && p.size !== productInCart.size) return p;
            p.quantity += productInCart.quantity;
            return p;
        })

        dispatch({ type: '[Cart] - Add product', payload: updatedProducts })
    }

    return (
        <CartContext.Provider value={{
            ...state,
            onAddProductToCart
        }}>
            {children}
        </CartContext.Provider>
    )
};