import { createContext } from 'react';
import { ICartProduct } from '@/interfaces/cart';

interface ContextProps {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    iva: number;
    total: number;
    

    onAddProductToCart: (product: ICartProduct) => void;
    onUpdateQuantityCart: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
}


export const CartContext = createContext({} as ContextProps);