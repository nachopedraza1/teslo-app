import { useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { UiContext } from '@/context';

import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

export const Navbar = () => {

    const { asPath } = useRouter();

    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <Link component={NextLink} href='/' display='flex' alignItems='center'>
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>

                <Box flex={1} />

                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <NextLink href='/category/men' >
                        <Button color={asPath === "/category/men" ? 'primary' : 'info'}>Hombres</Button>
                    </NextLink>
                    <NextLink href='/category/women' >
                        <Button color={asPath === "/category/women" ? 'primary' : 'info'}>Mujeres</Button>
                    </NextLink>
                    <NextLink href='/category/kid' >
                        <Button color={asPath === "/category/kid" ? 'primary' : 'info'}>Niños</Button>
                    </NextLink>
                </Box>


                <Box flex={1} />

                <IconButton>
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" >

                    <IconButton>
                        <Badge badgeContent={2} color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>

                </NextLink>


                <Button onClick={toggleSideMenu}>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}
