import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Box, Card, CardContent, Divider, Grid, Typography, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined, Try } from '@mui/icons-material';

import { PayPalButtons } from "@paypal/react-paypal-js"
import { ShopLayout } from '@/components/layouts/ShopLayout';
import { CartList, OrderSummary } from '@/components/cart';

import { dbOrders } from '@/database';
import { tesloApi } from '@/api';

import { IOrder } from '@/interfaces';
import { useState } from 'react';

type OrderResponseBody = {
    id: string;
    status:
    | "CREATED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const router = useRouter();

    const { _id, numberOfItems, isPaid, shippingAdress, subTotal, total, iva } = order;

    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async (details: OrderResponseBody) => {

        if (details.status !== 'COMPLETED') {
            return alert('No hay pago en Paypal');
        }

        setIsPaying(true);

        try {

            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();

        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }

    }


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

            <Grid container className='fadeIn'>
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

                            <Box sx={{ mt: 3 }} display="flex" flexDirection='column'>
                                {/* TODO */}

                                <Box display="flex"
                                    justifyContent="center"
                                    className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none' }}>
                                    <CircularProgress />
                                </Box>

                                <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} >
                                    {
                                        order.isPaid
                                            ? (
                                                <Chip
                                                    sx={{ my: 2 }}
                                                    label="Orden ya fue pagada"
                                                    variant='outlined'
                                                    color="success"
                                                    icon={<CreditScoreOutlined />}
                                                />

                                            ) : (
                                                <PayPalButtons
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [
                                                                {
                                                                    amount: {
                                                                        value: `${order.total}`,
                                                                    },
                                                                },
                                                            ],
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order!.capture().then((details) => {
                                                            onOrderCompleted(details);
                                                            // console.log({ details  })
                                                            // const name = details.payer.name.given_name;
                                                            // alert(`Transaction completed by ${name}`);
                                                        });
                                                    }}
                                                />
                                            )
                                    }
                                </Box>

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