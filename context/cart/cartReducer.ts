import { ICartProduct } from '@/interfaces/cart';
import { CartState, ShippingAdress } from './';


type CartActionType =
    | { type: '[Cart] - LoadCart from cookies', payload: ICartProduct[] }
    | { type: '[Cart] - Update Quantity product', payload: ICartProduct[] }
    | { type: '[Cart] - Update product', payload: ICartProduct[] }
    | { type: '[Cart] - Remove product', payload: ICartProduct[] }
    | { type: '[Cart] - Load Address', payload: ShippingAdress }
    | { type: '[Cart] - Update Address', payload: ShippingAdress }
    | {
        type: '[Cart] - Update Order summary',
        payload: {
            numberOfItems: number;
            subTotal: number;
            iva: number;
            total: number;
        }
    }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case '[Cart] - LoadCart from cookies':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Update product':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Update Quantity product':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Remove product':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Update Order summary':
            return {
                ...state,
                ...action.payload
            }

        case '[Cart] - Update Address':
        case '[Cart] - Load Address':
            return {
                ...state,
                shippingAdress: action.payload
            }

        default:
            return state;
    }

}