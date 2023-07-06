import { useContext } from 'react';
import NextLink from 'next/link';

import { CartContext } from '@/context';

import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts/ShopLayout';
import { CartList, OrderSummary } from '@/components/cart';
import { countries } from '@/utils';

const SummaryPage = () => {

    const { shippingAdress, numberOfItems } = useContext(CartContext);

    if (!shippingAdress) {
        return <></>
    }

    const { address, city, country, firstName, lastName, phone, zip, address2 = '' } = shippingAdress;

    return (
        <ShopLayout title='Resumen de orden' pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address'>
                                    Editar
                                </NextLink>
                            </Box>


                            <Typography> {firstName} {lastName} </Typography>
                            <Typography>{address} </Typography>
                            <Typography> {city} , {zip} </Typography>
                            <Typography> {countries.find(c => c.code === country)?.name} </Typography>
                            <Typography> {phone} </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref>
                                    Editar
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button color="secondary" className='circular-btn' fullWidth>
                                    Confirmar Orden
                                </Button>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>
    )
}

export default SummaryPage;