import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';

import { Link, Box, Card, CardContent, Divider, Grid, Typography, Chip } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout } from '@/components/layouts/ShopLayout';
import { CartList, OrderSummary } from '@/components/cart';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const { _id, numberOfItems, isPaid, shippingAdress, subTotal, total, iva } = order;


    return (
        <ShopLayout title='Resumen de la orden 123671523' pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Orden: {_id} </Typography>


            {
                !isPaid ?
                    (
                        <Chip
                            sx={{ my: 2 }}
                            label="Pendiente de pago"
                            variant='outlined'
                            color="error"
                            icon={<CreditCardOffOutlined />}
                        />
                    ) :
                    (
                        <Chip
                            sx={{ my: 2 }}
                            label="Orden ya fue pagada"
                            variant='outlined'
                            color="success"
                            icon={<CreditScoreOutlined />}
                        />
                    )
            }

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>


                            <Typography> {shippingAdress.firstName} {shippingAdress.lastName} </Typography>
                            <Typography> {shippingAdress.address} </Typography>
                            <Typography> {shippingAdress.city}, {shippingAdress.zip}, {shippingAdress.country}  </Typography>
                            <Typography> {shippingAdress.phone} </Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary orderValues={{
                                numberOfItems,
                                subTotal,
                                total,
                                iva
                            }} />

                            <Box sx={{ mt: 3 }}>
                                {
                                    !isPaid ?
                                        (
                                            <h1>Pagar</h1>
                                        ) : (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Orden ya fue pagada"
                                                variant='outlined'
                                                color="success"
                                                icon={<CreditScoreOutlined />}
                                            />
                                        )
                                }

                            </Box>

                        </CardContent>
                        
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderbyId(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }

    if (session.user._id !== order.user) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }


    return {
        props: {
            order
        }
    }
}



export default OrderPage;