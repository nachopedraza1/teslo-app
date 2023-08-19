import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { Order, Product } from '@/models';
import { IOrder, IOrderItem, IUser } from '@/interfaces';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

type Data =
    | { message: string }
    | IOrder


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder(req, res);

        default:
            res.status(400).json({ message: 'bad request' })
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;

    const productsIds = orderItems.map(product => product._id);

    await db.connect();

    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {
        const subTotal = orderItems.reduce((prev, current) => {
            

            return (current.price * current.quantity) + prev;
        }, 0)
    } catch (error) {

    }


    return res.status(201).json({ message: 'asd' })

}
