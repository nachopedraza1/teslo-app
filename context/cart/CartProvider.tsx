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

        let productExist = state.cart.find(product => product._id === productInCart._id)
        if (productExist) {
            productExist = { ...productExist, quantity: productExist.quantity + productInCart.quantity }
            console.log(productExist);
        }

        dispatch({ type: '[Cart] - Add product', payload: productInCart })
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