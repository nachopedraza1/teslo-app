import { db, dbOrders } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
    numberOfOrders: number;
    paidOrders: number; // isPad true
    notPaidOrders: number;
    numberOfClients: number; // role: client
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; // productos con 10 o menos
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.find().lean().count(),
        Order.find({ isPaid: true }).lean().count(),
        User.find({ role: 'client' }).lean().count(),
        Product.find().lean().count(),
        Product.find({ inStock: 0 }).count(),
        Product.find({ inStock: { $lte: 5 } }).count(),
    ]);

    await db.disconnect();


    const data = {
        numberOfOrders,
        paidOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    }


    return res.status(200).json(data)
}