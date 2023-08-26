import { ISize } from "./products";
import { IUser } from "./user";

export interface IOrder {
    _id?: string;
    user?: IUser | string;
    orderItems: IOrderItem[];
    shippingAdress: ShippingAdress;
    paymentResult?: string;
    images?: string;
    numberOfItems: number;
    subTotal: number;
    iva: number;
    total: number;

    isPaid: boolean;
    paidAt?: string;

    transactionId?: String;
}

export interface IOrderItem {
    _id: string;
    title: string;
    size: ISize;
    quantity: number;
    slug: string;
    images: string;
    price: number;
    gender: string;
}

export interface ShippingAdress {
    firstName: string,
    lastName: string,
    address: string,
    address2?: string,
    zip: string,
    city: string,
    country: string,
    phone: string,
}