import { createContext } from 'react';
import { ICartProduct } from '@/interfaces/cart';
import { ShippingAdress } from './';

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    iva: number;
    total: number;
    shippingAdress?: ShippingAdress,

    onAddProductToCart: (product: ICartProduct) => void;
    onUpdateQuantityCart: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAdress: (adress: ShippingAdress) => void;
}


export const CartContext = createContext({} as ContextProps);