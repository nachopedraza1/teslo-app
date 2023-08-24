import { createContext } from 'react';
import { ICartProduct, ShippingAdress } from '@/interfaces';

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
    createOrder: () => Promise<{ hasError: boolean; message: string; }>
}


export const CartContext = createContext({} as ContextProps);