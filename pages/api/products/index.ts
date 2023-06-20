import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { Product } from '@/models';
import { IProduct } from '@/interfaces';

type Data =
    | { message: string }
    | IProduct[]

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        default:
            return res.status(400).json({ message: 'El metodo no existe.' })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { gender = 'all' } = req.query;

    let condition = {}

    if (gender !== 'all' && ['men', 'women', 'kid', 'unisex'].includes(`${gender}`)) {
        condition = { gender }
    }


    await db.connect();
    const Products = await Product
        .find(condition)
        .select('title images price inStock slug -_id')
        .lean();
    await db.disconnect();

    res.status(200).json(Products);
}
