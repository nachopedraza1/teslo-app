import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database';
import { User } from '@/models';

import { IUser } from '@/interfaces';

type Data =
    | { name: string }
    | IUser[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUser(req, res);
    }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json(users);
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
}

