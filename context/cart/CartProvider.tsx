import { FC, ReactNode, useEffect, useReducer } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces/cart';
import Cookie from 'js-cookie';

export interface CartState {
    cart: ICartProduct[];
}


const Cart_INITIAL_STATE: CartState = {
    cart: [],
}


export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, Cart_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
            dispatch({ type: '[Cart] - LoadCart from cookies', payload: cookieProducts })
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies', payload: [] })
        }
    }, [])

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])


    const onAddProductToCart = (productInCart: ICartProduct) => {

        const productExist = state.cart.some(prod => prod._id === productInCart._id && prod.size === productInCart.size);

        if (!productExist) {
            return dispatch({ type: '[Cart] - Update product', payload: [...state.cart, productInCart] });
        }

        const products = state.cart.map(prod => {
            if (prod._id !== productInCart._id) return prod;
            if (prod.size !== productInCart.size) return prod;
            prod.quantity += productInCart.quantity
            return prod;
        })

        dispatch({ type: '[Cart] - Update product', payload: products })

    }

    const onUpdateQuantityCart = (product: ICartProduct) => {

    }

    return (
        <CartContext.Provider value={{
            ...state,
            onAddProductToCart,
            onUpdateQuantityCart
        }}>
            {children}
        </CartContext.Provider>
    )
};