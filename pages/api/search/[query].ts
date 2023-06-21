import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
    | { message: string }
    | IProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProduct(req, res);

        default:
            return res.status(400).json({ message: 'El método no es válido.' })
    }
}

async function searchProduct(req: NextApiRequest, res: NextApiResponse<Data>) {

    let { query = '' } = req.query;

    if (query.length === 0) {
        return res.status(400).json({ message: 'No se especifico el query de búsqueda.' })
    }

    query = query.toString().toLowerCase();

    await db.connect();
    const products = await Product.find({ $text: { $search: query } }).lean();
    await db.disconnect();

    if (products.length === 0) {
        return res.status(400).json({ message: 'No se encontraron productos' })
    }

    return res.status(200).json(products)
}
