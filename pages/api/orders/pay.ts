import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { isValidObjectId } from 'mongoose';

import { db } from '@/database';
import { Order } from '@/models';

import { PaypalOrderStatusResponse } from '@/interfaces/paypal';

type Data =
    { message: string }
    | PaypalOrderStatusResponse


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder(req, res);

        default:
            return res.status(200).json({ message: 'Example' })
    }

}


const getPaypalBarerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try {

        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
            return null
        } else {
            console.log(error);
            return null;
        }
    }

}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    /*  const session = await getSession({ req })
 
     if (!session) {
         return res.status(400).json({ message: 'No hay session' })
     } */

    const { orderId = '', transactionId = '' } = req.body;

    const paypayBarerToken = await getPaypalBarerToken();

    if (!paypayBarerToken) {
        return res.status(400).json({ message: 'No se pudo confirmar el token.' })
    }

    if (!isValidObjectId(orderId)) {
        return res.status(400).json({ message: 'El ID de la orden no es válido.' })
    }

    try {

        const { data } = await axios.get<PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${paypayBarerToken}`
            }
        })

        if (data.status !== 'COMPLETED') {
            return res.status(400).json({ message: 'La orden no esta pagada.' })
        }

        await db.connect();
        const order = await Order.findById(orderId);

        if (!order) {
            await db.disconnect();
            return res.status(400).json({ message: 'La orden no existe.' })
        }

        if (Number(data.purchase_units[0].amount.value) !== order.total) {
            await db.disconnect();
            return res.status(400).json({ message: 'Los montos de la orden no coinciden.' })
        }

        order.transactionId = transactionId;
        order.isPaid = true;

        await order.save();
        await db.disconnect();

        return res.status(200).json(data)

    } catch (error) {
        return res.status(400).json({ message: "Error." })
    }

}
