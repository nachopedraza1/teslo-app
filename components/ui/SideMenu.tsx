import { useContext, useState } from "react"
import { useRouter } from "next/router";

import { AuthContext, UiContext } from "@/context";

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"


export const SideMenu = () => {

    const { IsLoggedIn, user, logoutUser } = useContext(AuthContext);

    const { push, asPath } = useRouter();

    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    const [searchTermn, setSearchTermn] = useState('');

    const onSearchTermn = () => {
        if (searchTermn.trim().length === 0) return;
        navigateTo(`/search/${searchTermn}`)
    }

    const navigateTo = (url: string) => {
        toggleSideMenu();
        push(url);
    }

    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>

                <List>

                    <ListItem>
                        <Input
                            autoFocus
                            type='text'
                            placeholder="Buscar..."
                            value={searchTermn}
                            onChange={(e) => setSearchTermn(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTermn() : null}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTermn}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItemButton sx={{ display: IsLoggedIn ? 'flex' : 'none' }}>
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItemButton>

                    <ListItemButton sx={{ display: IsLoggedIn ? 'flex' : 'none' }} onClick={() => navigateTo('/orders/history')}>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItemButton>

                    <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/men')}>
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItemButton>


                    <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/women')}>
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItemButton>

                    <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/kid')}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItemButton>


                    <ListItemButton sx={{ display: IsLoggedIn ? 'none' : 'flex' }} onClick={() => navigateTo(`${asPath !== '/' ? `/auth/login?p=${asPath}` : '/auth/login'} `)}>
                        <ListItemIcon>
                            <VpnKeyOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItemButton>

                    <ListItemButton sx={{ display: IsLoggedIn ? 'flex' : 'none' }} onClick={logoutUser}>
                        <ListItemIcon>
                            <LoginOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItemButton>


                    {/* Admin */}
                    <Divider />
                    {
                        user?.role === 'admin' && (
                            <>
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItemButton onClick={() => navigateTo('/admin/')} >
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItemButton>

                                < ListItemButton >
                                    <ListItemIcon>
                                        <CategoryOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItemButton>

                                <ListItemButton>
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItemButton>
                            </>
                        )
                    }
                </List>
            </Box>
        </Drawer >
    )
}