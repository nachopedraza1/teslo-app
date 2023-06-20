import { db } from '@/database';
import { IProduct } from '@/interfaces'
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
    | { message: string }
    | IProduct


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProductsBySlug(req, res);

        default:
            return res.status(400).json({ message: 'El metodo no existe.' })
    }
}

const getProductsBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { slug } = req.query;

    await db.connect();
    const ProductBySlug = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if (!ProductBySlug) {
        return res.status(404).json({ message: 'No se encontro ningun producto.' })
    }

    res.status(200).json(ProductBySlug)
}
