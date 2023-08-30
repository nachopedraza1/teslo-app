import type { NextApiRequest, NextApiResponse } from 'next'
import { Order, Product, User } from '@/models';
import { db } from '@/database';

import { DashboardData } from '@/interfaces';


export default async function handler(req: NextApiRequest, res: NextApiResponse<DashboardData>) {

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