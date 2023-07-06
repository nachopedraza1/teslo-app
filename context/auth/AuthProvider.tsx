import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { AuthContext, authReducer } from './';

import { isAxiosError } from 'axios';
import Cookies from 'js-cookie';

import { tesloApi } from '@/api';
import { IUser } from '@/interfaces';

export interface AuthState {
    IsLoggedIn: boolean;
    user?: IUser;
}


const Auth_INITIAL_STATE: AuthState = {
    IsLoggedIn: false,
    user: undefined,
}


export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const router = useRouter();

    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async () => {

        if (!Cookies.get('token')) return;

        try {
            const { data } = await tesloApi.get('/user/validate-token')
            const { token, user } = data;
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user })
        } catch (error) {
            Cookies.remove('token')
        }
    }


    const loginUser = async (email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user })
            return true;
        } catch (error) {
            return false;
        }
    }

    const registerUser = async (name: string, email: string, password: string) => {
        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false
            }
        } catch (error) {
            if (isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'Algo salio mal, por favor intentelo de nuevo mas tarde.'
            }
        }
    }

    const logoutUser = () => {
        Cookies.remove('token');
        Cookies.remove('cart')
        router.reload();
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            loginUser,
            registerUser,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    )
};
