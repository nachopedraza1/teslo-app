import type { NextApiRequest, NextApiResponse } from 'next'
import { db, dbProduct } from '@/database';
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

    const session: any = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: 'Debe estar autenticado para enviar una orden' });
    }

    const productsIds = orderItems.map(product => product._id);

    await db.connect();

    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(product => product.id === current._id)!.price;
            if (!currentPrice) {
                throw new Error('Verifique el carrito de nuevo, producto no existe.')
            }
            return (currentPrice * current.quantity) + prev;
        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_IVA_RATE || 0);
        const totalBackend = subTotal * (taxRate + 1);

        if (total !== totalBackend) {
            throw new Error('El total no cuadra con el monto.')
        }

        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
        await newOrder.save();
        return res.status(201).json(newOrder)

    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json(error.message || 'Revise logs del servidor')
    }


    res.status(200).json(req.body)
}
