import { createContext } from 'react';
import { ICartProduct } from '@/interfaces/cart';

interface ContextProps {
    cart: ICartProduct[];
    onAddProductToCart: (product: ICartProduct) => void;
    onUpdateQuantityCart: (product: ICartProduct) => void;
}


export const CartContext = createContext({} as ContextProps);