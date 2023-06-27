import { ICartProduct } from '@/interfaces/cart';
import { CartState } from './';


type CartActionType =
    | { type: '[Cart] - LoadCart from cookies', payload: ICartProduct[] }
    | { type: '[Cart] - Update product', payload: ICartProduct[] }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case '[Cart] - LoadCart from cookies':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Update product':
            return {
                ...state,
                cart: [...action.payload]
            }

        default:
            return state;
    }

}