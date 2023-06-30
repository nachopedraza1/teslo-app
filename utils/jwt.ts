import jwt from 'jsonwebtoken';


export const signToken = (_id: string, email: string) => {

    if (!process.env.JWT_SECRET) {
        throw new Error('No hay variable de entorno para token.')
    }

    return jwt.sign(
        { _id, email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
}