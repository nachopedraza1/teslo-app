import { db } from ".";
import { isValidObjectId } from "mongoose"
import { IOrder } from "@/interfaces"
import { Order } from "@/models";

export const getOrderbyId = async (id: string): Promise<IOrder | null> => {

    if (!isValidObjectId(id)) return null;

    await db.connect();
    const order = await Order.findById(id).lean();
    await db.disconnect();

    if (!order) return null;

    return JSON.parse(JSON.stringify(order));
}


export const getOrdersUser = async (id: string): Promise<IOrder[]> => {

    if (!isValidObjectId(id)) return [];

    await db.connect();
    const orders = await Order.find({ user: id })
    await db.disconnect();

    return JSON.parse(JSON.stringify(orders));
}
