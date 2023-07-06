import { FC, ReactNode, useEffect, useReducer, useRef } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces/cart';
import Cookie from 'js-cookie';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    iva: number;
    total: number;
}


const Cart_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    iva: 0,
    total: 0,
}


export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, Cart_INITIAL_STATE);


    let firstTimeLoad = useRef(true);

    const loadCookies = async () => {
        try {
            const productCookies = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
            await dispatch({ type: '[Cart] - LoadCart from cookies', payload: productCookies })
        } catch (error) {
            await dispatch({ type: '[Cart] - LoadCart from cookies', payload: [] })
        } finally {
            firstTimeLoad.current = false;
        }
    }

    useEffect(() => {
        loadCookies();
    }, [])


    useEffect(() => {
        if (firstTimeLoad.current) return;
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])



    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0)
        const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0)
        const ivaRate = Number(process.env.NEXT_PUBLIC_IVA_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            iva: subTotal * ivaRate,
            total: subTotal * (ivaRate + 1)
        }
        dispatch({ type: '[Cart] - Update Order summary', payload: orderSummary })

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
        const cartProducts = state.cart.map(prod => {
            if (prod._id !== product._id) return prod;
            if (prod.size !== product.size) return prod;
            prod.quantity = product.quantity;
            return prod;
        })
        dispatch({ type: '[Cart] - Update Quantity product', payload: cartProducts });
    }

    const removeCartProduct = (product: ICartProduct) => {
        const cartOnRemoveProduct = state.cart.filter(prod => !(prod._id === product._id && prod.size === product.size))
        dispatch({ type: '[Cart] - Remove product', payload: cartOnRemoveProduct })
    }

    return (
        <CartContext.Provider value={{
            ...state,
            onAddProductToCart,
            onUpdateQuantityCart,
            removeCartProduct,
        }}>
            {children}
        </CartContext.Provider>
    )
};