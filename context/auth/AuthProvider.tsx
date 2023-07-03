import { FC, ReactNode, useReducer } from 'react';
import { AuthContext, authReducer } from './';

import Cookies from 'js-cookie';

import { tesloApi } from '@/api';
import { IUser } from '@/interfaces';
import { isAxiosError } from 'axios';

export interface AuthState {
    IsLoggedIn: boolean;
    user?: IUser;
}


const Auth_INITIAL_STATE: AuthState = {
    IsLoggedIn: false,
    user: undefined,
}


export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

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
            dispatch({ type: '[Auth] - Login', payload: user })
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

    return (
        <AuthContext.Provider value={{
            ...state,
            loginUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
};