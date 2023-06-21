import { FC, ReactNode, useReducer } from 'react';
import { UiContext, UiReducer } from './';

export interface UiState {
    isMenuOpen: boolean;
}


const Ui_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}


export const UiProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {

    const [state, dispatch] = useReducer(UiReducer, Ui_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({ type: '[Ui] - ToggleMenu' })
    }

    return (
        <UiContext.Provider value={{
            ...state,
            toggleSideMenu,
        }}>
            {children}
        </UiContext.Provider>
    )
};